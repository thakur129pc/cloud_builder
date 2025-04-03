import React, { useState, useEffect } from 'react';
import { Parameter } from '../../../types/DashboardTypes';
import { toast } from 'react-toastify';

interface ParameterModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (parameter: Parameter) => void;
}

const ParameterModal: React.FC<ParameterModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [parameterName, setParameterName] = useState('');
  const [description, setDescription] = useState('');

  // Reset form when modal becomes visible
  useEffect(() => {
    if (visible) {
      setParameterName('');
      setDescription('');
    }
  }, [visible]);

  const handleSave = () => {
    if (!parameterName.trim()) {
      toast.error('Parameter name is required');
      return;
    }
    if (!description.trim()) {
      toast.error('Parameter description is required');
      return;
    }

    const newParameter: Parameter = {
      is_new_parameter: true,
      parameter_name: parameterName,
      parameter_descryption: description,
    };

    onSave(newParameter);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay" style={modalOverlayStyle}>
      <div className="modal-dialog" style={modalDialogStyle}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Parameter</h5>
            <button type="button" className="close" onClick={onClose}>
              &times;
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="name" className="labels">
                Parameter Name
              </label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={parameterName}
                placeholder="Enter parameter name"
                onChange={(e) => setParameterName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description" className="labels">
                Parameter Description
              </label>
              <textarea
                className="form-control"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter parameter description"
                maxLength={255}
                style={{ resize: 'vertical' }}
                rows={3}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="mt-m-20 btn btn-secondary btn-xs btn-tcenter action-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="mt-m-20 btn btn-info btn-xs btn-tcenter action-btn"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1050,
};

const modalDialogStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: '4px',
  width: '500px',
  maxWidth: '90%',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
};

export default ParameterModal;
