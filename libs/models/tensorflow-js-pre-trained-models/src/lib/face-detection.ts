export type FaceDetectionOutput = {
  box: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    width: number;
    height: number;
  };
  keypoints: { x: number; y: number; name: string }[];
}[];
