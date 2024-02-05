import styles from './FaceRecognition.module.css';

export interface IDetectionBox {
  topRow?: number;
  bottomRow?: number;
  rightCol?: number;
  leftCol?: number;
}

export const FaceRecognition = ({
  imageUrl,
  boxes,
}: {
  imageUrl: string;
  boxes: IDetectionBox[];
}) => {
  if (imageUrl) {
    return (
      <div className="center ma">
        <div className="mt-2 absolute">
          <img
            id="inputImage"
            src={imageUrl}
            alt=""
            width="500px"
            height="auto"
          />
          {boxes?.length &&
            boxes.map((box: IDetectionBox) => (
              <div
                className={styles['bounding-box']}
                key={(
                  (box?.leftCol || 1) *
                  (box?.rightCol || 1) *
                  (box?.bottomRow || 1) *
                  (box?.topRow || 1)
                ).toString()}
                style={{
                  top: box.topRow,
                  right: box.rightCol,
                  bottom: box.bottomRow,
                  left: box.leftCol,
                  width: (box.rightCol || 0) - (box.leftCol || 0),
                  height: (box.bottomRow || 0) - (box.topRow || 0),
                }}
              />
            ))}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default FaceRecognition;
