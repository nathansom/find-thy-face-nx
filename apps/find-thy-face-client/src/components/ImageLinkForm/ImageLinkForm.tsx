import styles from './ImageLinkForm.module.css';

export const ImageLinkForm = ({
  onInputChange,
  onButtonSubmit,
}: {
  onInputChange: React.ChangeEventHandler<HTMLInputElement>;
  onButtonSubmit: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <div>
      <p className="text-gray-50 text-md">
        {'This Magic Brain will detect faces in your pictures.'}
      </p>
      <div className="flex items-center justify-center">
        <div className={`${styles.form} p-4 m-3`}>
          <input
            className="text-white"
            type="file"
            onChange={onInputChange}
            accept="image/png, image/jpeg"
          />
          <button className="btn-primary" onClick={onButtonSubmit}>
            DETECT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
