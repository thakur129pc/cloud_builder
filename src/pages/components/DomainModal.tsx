import React from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';

interface ConfirmationModalProps {
  open: boolean;
  onCloseModal: () => void;
  onOpenModal?: () => void;
  handleVerifyDomain?: () => void;
  setDomain?: React.Dispatch<React.SetStateAction<string>>;
  domainResponse?: string;
  domain?: string;
  title?: string;
  placeholder?: string;
  inputValue?: string;
  setInputValue?: React.Dispatch<React.SetStateAction<string>>;
  buttonText?: string;
  onButtonClick?: () => void;
  responseMessage?: string;
  responseClassName?: string;
  children?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onCloseModal,
  title = 'Enter Information',
  buttonText = 'Submit',
  onButtonClick,
  responseMessage,
  responseClassName = '',
  children,
}) => {
  return (
    <Modal open={open} onClose={onCloseModal} center>
      <div
        style={{ display: 'flex', flexDirection: 'column' }}
        className="dynamic-modal"
      >
        <h2>{title}</h2>
        {responseMessage && (
          <p className={responseClassName}>{responseMessage}</p>
        )}
        {children}
        {onButtonClick && (
          <button
            type="button"
            style={{ margin: '15px 0 0' }}
            className="btn btn-info w-auto"
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
