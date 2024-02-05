import '@tensorflow/tfjs-backend-webgl';
import { setBackend } from '@tensorflow/tfjs';
import {
  MediaPipeFaceDetectorTfjsModelConfig,
  SupportedModels,
  createDetector,
} from '@tensorflow-models/face-detection';

export const handleFaceDetection = async (imageElement: HTMLImageElement) => {
  await setBackend('webgl');
  const model = SupportedModels.MediaPipeFaceDetector,
    detectorConfig: MediaPipeFaceDetectorTfjsModelConfig = {
      runtime: 'tfjs',
    },
    detector = await createDetector(model, detectorConfig);

  try {
    const faces = await detector.estimateFaces(imageElement);

    return { data: faces };
  } catch (e: unknown) {
    console.error('Failed to perform face detection on the image', e);
    return null;
  }
};
