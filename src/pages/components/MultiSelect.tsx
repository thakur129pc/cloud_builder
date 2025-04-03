import React from 'react';
import './MultiSelect.css'; // Add this line to import the CSS for styling
import { models, ModelsName } from '../../utils/ModelsData';

interface MultiSelectProps {
  handleSelect: (model: ModelsName) => void; // Function to handle selecting a model
  handleRemove: (model: ModelsName) => void; // Function to handle removing a selected model
  toggleDropdown: () => void; // Function to toggle the dropdown
  selectedModels: ModelsName[]; // An array of selected model names
  isDropdownOpen: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  handleSelect,
  handleRemove,
  toggleDropdown,
  selectedModels,
  isDropdownOpen,
}) => {
  return (
    <div className="multi-select">
      <div className="selected-container" onClick={toggleDropdown}>
        {selectedModels.map((model) => (
          <span className="selected-item" key={model.llm_family_id}>
            {model.llm_family}{' '}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(model);
              }}
            >
              ✖
            </button>
          </span>
        ))}
        <span className="placeholder">
          {selectedModels.length === 0 && 'Select'}
        </span>
      </div>

      {isDropdownOpen && (
        <div className="dropdown">
          {models.map((model) => (
            <div
              key={model.llm_family_id}
              className={`dropdown-item ${
                selectedModels.some(
                  (selectedModel) =>
                    selectedModel.llm_family_id === model.llm_family_id
                )
                  ? 'selected'
                  : ''
              }`}
              onClick={() => handleSelect(model)}
            >
              {model.llm_family}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
