import {
  ChangeEvent,
  ChangeEventHandler,
  Reducer,
  useEffect,
  useReducer,
} from 'react';
import { Particles, initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { Face } from '@tensorflow-models/face-detection';

import './App.css';
import { Navigation } from '../components/Navigation';
import { Logo } from '../components/Logo';
import { ImageLinkForm } from '../components/ImageLinkForm';
import { FaceRecognition, IDetectionBox } from '../components/FaceRecognition';
import { Rank } from '../components/Rank';
import { SignIn } from '../components/SignIn';
import { Register } from '../components/Register';
import { particlesOptions } from './particleOptions';
import { handleFaceDetection } from '../lib/face-detection';
import { BoundingBox } from '@tensorflow-models/face-detection/dist/shared/calculators/interfaces/shape_interfaces';
import { ToastContainer, Bounce, toast } from 'react-toastify';

export interface IUser {
  email: string;
  id: string;
  name: string;
  entries: number;
  joined: Date | string;
}

const ACTIONS = [
    'initParticles',
    'setInput',
    'setImageUrl',
    'setImageDimensions',
    'setBox',
    'setRoute',
    'setIsSignedIn',
    'setUser',
    'signOut',
  ] as const,
  ROUTES = ['home', 'signin', 'signedout', 'register'] as const;

export type AllowedAction = (typeof ACTIONS)[keyof typeof ACTIONS];

export type AllowedRoute = (typeof ROUTES)[keyof typeof ROUTES];

export interface IAction {
  type: AllowedAction;
  payload?:
    | string
    | HTMLImageElement
    | number
    | boolean
    | AllowedRoute
    | IDetectionBox[]
    | IUser
    | { imageActualWidth: number; imageActualHeight: number };
}

export interface IAppState {
  input: HTMLImageElement | null;
  imageUrl: string;
  imageDimensions: {
    imageActualWidth: number;
    imageActualHeight: number;
  } | null;
  boxes: IDetectionBox[];
  route: AllowedRoute;
  isSignedIn: boolean;
  user: IUser;
  particlesInitialized: boolean;
}

const initialState: IAppState = {
    input: null,
    imageUrl: '',
    imageDimensions: null,
    boxes: [],
    route: 'signin',
    isSignedIn: false,
    user: {
      email: '',
      id: '',
      name: '',
      entries: 0,
      joined: '',
    },
    particlesInitialized: false,
  },
  reducer: Reducer<IAppState, IAction> = (prevState, action) => {
    const { type, payload } = action;

    switch (type) {
      case 'initParticles':
        return { ...prevState, particlesInitialized: true };
      case 'setBox':
        return { ...prevState, boxes: payload as IDetectionBox[] };
      case 'setImageUrl':
        return { ...prevState, imageUrl: payload as string };
      case 'setImageDimensions':
        return {
          ...prevState,
          imageDimensions: payload as {
            imageActualWidth: number;
            imageActualHeight: number;
          },
        };
      case 'setInput':
        return { ...prevState, input: payload as HTMLImageElement };
      case 'setIsSignedIn':
        return { ...prevState, isSignedIn: payload as boolean };
      case 'setRoute':
        return {
          ...prevState,
          route: payload as (typeof ROUTES)[keyof typeof ROUTES],
        };
      case 'setUser':
        return { ...prevState, user: payload as IUser };
      case 'signOut':
        return { ...prevState, isSignedIn: false, route: 'signin' };
      default:
        return prevState;
    }
  };

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState),
    loadUser = (data: IUser) => {
      dispatch({ type: 'setUser', payload: data });
    },
    calculateFaceLocation = (boundingBoxes: BoundingBox[]) => {
      const image = document.getElementById('inputImage') as HTMLImageElement,
        widthRatio =
          image.width / (state.imageDimensions?.imageActualWidth || 1),
        heightRatio =
          image.height / (state.imageDimensions?.imageActualHeight || 1);

      return boundingBoxes.map((box: BoundingBox) => ({
        leftCol: box.xMin * widthRatio,
        topRow: box.yMin * heightRatio,
        rightCol: box.xMax * widthRatio,
        bottomRow: box.yMax * heightRatio,
      }));
    },
    displayFaceBox = (boxes: IDetectionBox[]) => {
      dispatch({ type: 'setBox', payload: boxes });
    },
    onInputChange: ChangeEventHandler<HTMLInputElement> = async (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      dispatch({ type: 'setBox', payload: [] });

      if (event.target.files?.length) {
        const file = event.target.files[0],
          img = new Image(),
          objectUrl = URL.createObjectURL(file);

        img.src = objectUrl;
        img.alt = file.name;
        img.onload = () =>
          dispatch({
            type: 'setImageDimensions',
            payload: {
              imageActualWidth: img.naturalWidth,
              imageActualHeight: img.naturalHeight,
            },
          });

        dispatch({
          type: 'setInput',
          payload: img,
        });

        dispatch({ type: 'setImageUrl', payload: objectUrl });
      }
    },
    onButtonSubmit = async () => {
      toast.promise(
        (async () => {
          const data: { data: Face[] } | null =
              state.input && (await handleFaceDetection(state.input)),
            faces = data?.data;

          if (data) {
            const entryRes = await fetch(
                process.env.REACT_APP_BACKEND_URL + '/entries',
                {
                  method: 'put',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: state.user.id,
                  }),
                }
              ),
              count = (await entryRes.json()).entries;

            dispatch({
              type: 'setUser',
              payload: { ...state.user, entries: count },
            });
          }

          if (!faces?.length) {
            toast.error('No face is detectable on this image.');
          } else {
              displayFaceBox(
                calculateFaceLocation(faces.map((face: Face) => face.box))
              );

              toast.success(`${faces.length} ${faces.length > 1 ? "faces are" : "face is"} detected on this image.`)
          }
        })(),
        {
          pending: 'Analyzing the image . . . ',
          success: 'Image analysis is completed!',
          error: 'Failed to analyze this image.',
        }
      );
    },
    onRouteChange = (route: AllowedRoute) => {
      dispatch({ type: 'setRoute', payload: route });

      if (route === 'signedout') {
        dispatch({ type: 'signOut' });
      }

      if (route === 'home') {
        dispatch({ type: 'setIsSignedIn', payload: true });
      }
    },
    { isSignedIn, boxes, imageUrl, route, user, particlesInitialized } = state;

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
      dispatch({ type: 'initParticles' });
    });
  }, []);

  return (
    <div className="App">
      {particlesInitialized && (
        <Particles className="particles" options={particlesOptions} />
      )}
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      <Logo />
      {route === 'home' ? (
        <div>
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
        </div>
      ) : route === 'signin' ? (
        <SignIn loadUser={loadUser} onRouteChange={onRouteChange} />
      ) : (
        <Register loadUser={loadUser} onRouteChange={onRouteChange} />
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default App;
