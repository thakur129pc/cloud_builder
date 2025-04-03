/* eslint-disable react-hooks/exhaustive-deps */
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API } from '../../apiconfig';
import { toast } from 'react-toastify';
import {
  ApiErrorResponse,
  Certification,
  Destination,
} from '../../types/wizardTypes';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, ReduxState } from '../../redux/store';
import { updateLoadingState } from '../../redux/wizardSlice';
import SkeletonBox from '../components/SkeletonBox';

interface MissionStateType {
  certifications: Certification[];
  destination: Destination[];
}

interface SelectedStateType {
  certifications: string | number;
  destination: string | number;
}

const Mission: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const authObj = JSON.parse(localStorage.getItem('authObj') || '');
  const [missionState, setMissionState] = useState<MissionStateType>({
    certifications: [],
    destination: [],
  });
  const [selectedState, setSelectedState] = useState<SelectedStateType>({
    certifications: '',
    destination: '',
  });
  const WizardState = useSelector((state: ReduxState) => state.WizardSlice);

  useEffect(() => {
    const fetchData = async () => {
      dispatch(updateLoadingState(true));
      const initState = { certifications: [], destination: [] };
      try {
        const [missionResponse, certificatesResponse] =
          await Promise.allSettled([
            axios.get(API.API_CB + 'level'),
            axios.get(API.API_CB + 'certifications'),
          ]);

        const newMissionState = { ...initState };

        if (missionResponse.status === 'fulfilled') {
          newMissionState.destination = missionResponse.value.data.data;
        }
        if (certificatesResponse.status === 'fulfilled') {
          newMissionState.certifications = certificatesResponse.value.data.data;
        }
        setMissionState(newMissionState);
        dispatch(updateLoadingState(false));
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;
        toast.error(
          error.response?.data.message || 'An error occurred. Please try again.'
        );
        setMissionState({ ...initState });
        dispatch(updateLoadingState(false));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (WizardState.selectedCert && WizardState.selectedLevel) {
      setSelectedState({
        certifications: WizardState.selectedCert,
        destination: WizardState.selectedLevel,
      });
    }
  }, [WizardState.selectedCert, WizardState.selectedLevel]);

  const handleCheckboxChange = (
    value: number,
    identifier: 'certifications' | 'destination'
  ) => {
    setSelectedState((prevState) => {
      const newState = { ...prevState };
      newState[identifier] = newState[identifier] === value ? '' : value;
      return newState;
    });
  };

  const handleNext = async () => {
    try {
      if (!selectedState.certifications || !selectedState.destination) {
        toast.error('Please Select Certification level and Destination');
        return;
      }
      await Promise.all([
        axios.post(
          API.API_CB + 'level',
          { level_id: selectedState.destination },
          {
            headers: {
              Authorization: `Bearer ${authObj.access_token}`,
            },
          }
        ),
        axios.post(
          API.API_CB + 'certifications',
          { compliance_id: selectedState.certifications },
          {
            headers: {
              Authorization: `Bearer ${authObj.access_token}`,
            },
          }
        ),
      ]);
      navigate('/wizard/costs');
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      console.log('error', error);
      toast.error(error.response?.data.message || 'Internal server error');
    }
  };

  if (WizardState.loading) {
    return <SkeletonBox />;
  } else
    return (
      <section className="main-section">
        <div className="content-wrapper">
          <div className="panel panel-default main-body">
            <div className="row">
              <div className="col-sm-12">
                <div className="wizard" id="myWizard">
                  <div
                    className="step s5"
                    id="certification-level-screen"
                    data-type="wizard"
                    data-screen="s2"
                  >
                    <div className="panel-heading">
                      <h4 className="panel-title">Mission</h4>
                    </div>
                    <div
                      className="panel-body panel-collapse collapse in"
                      aria-expanded="true"
                    >
                      <div className="row">
                        <div className="col-sm-12">
                          <h4>Certification Levels</h4>
                        </div>
                      </div>
                      <div className="row form-group">
                        {missionState.certifications?.map((certificate) => (
                          <div
                            className="col-sm-4"
                            key={certificate?.compliance_id}
                            onClick={() =>
                              handleCheckboxChange(
                                certificate?.compliance_id,
                                'certifications'
                              )
                            }
                          >
                            <div
                              className={
                                selectedState.certifications ==
                                certificate?.compliance_id
                                  ? 'card-border card-wrapper selected'
                                  : 'card-border card-wrapper'
                              }
                              data-type="cert_level"
                              data-value="iso_27001"
                              data-image="iso_27001"
                            >
                              <div className="display-card">
                                <div className="color-strip color-blue"></div>
                                <div
                                  className="card-title"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <h4>{certificate?.certification_name}</h4>
                                  <div className="checkbox c-checkbox custom-grid-select m0">
                                    <label>
                                      <input
                                        type="checkbox"
                                        className="channel-type custom-radio-select"
                                        name="cert_level"
                                        data-parsley-multiple="cert_level"
                                        data-parsley-id="50"
                                        checked={
                                          selectedState.certifications ==
                                          certificate?.compliance_id
                                        }
                                        onChange={() =>
                                          handleCheckboxChange(
                                            certificate?.compliance_id,
                                            'certifications'
                                          )
                                        }
                                      />{' '}
                                      <span className="fa card-check"></span>
                                    </label>
                                  </div>
                                </div>
                                <div className="card-content">
                                  <ul className="card-points triangle-list">
                                    {certificate?.certification_features?.map(
                                      (feature) => (
                                        <li key={feature}>{feature}</li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              </div>
                              <div className="card-footer">&nbsp;</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="row">
                        <div className="col-sm-12">
                          <h4>Destination</h4>
                        </div>
                      </div>
                      <div className="row form-group">
                        {missionState.destination?.map((item) => (
                          <div
                            className="col-sm-4"
                            key={item?.destination_id}
                            onClick={() =>
                              handleCheckboxChange(
                                item?.destination_id,
                                'destination'
                              )
                            }
                          >
                            <div
                              className={
                                selectedState.destination ==
                                item?.destination_id
                                  ? 'card-border card-wrapper selected'
                                  : 'card-border card-wrapper'
                              }
                              data-type="destination"
                              data-value="just_kicking_the_tyres"
                              data-image="compliance_kicking_the_tyres"
                            >
                              <div className="display-card">
                                <div className="color-strip color-blue"></div>
                                <div
                                  className="card-title"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <h4>{item?.destination_name}</h4>
                                  <div className="checkbox c-checkbox custom-grid-select m0">
                                    <label>
                                      <input
                                        type="checkbox"
                                        className="channel-type custom-radio-select"
                                        name="destination"
                                        value="just_kicking_the_tyres"
                                        data-parsley-multiple="destination"
                                        data-parsley-id="57"
                                        checked={
                                          selectedState.destination ==
                                          item?.destination_id
                                        }
                                        onChange={() =>
                                          handleCheckboxChange(
                                            item?.destination_id,
                                            'destination'
                                          )
                                        }
                                      />{' '}
                                      <span className="fa card-check"></span>
                                    </label>
                                  </div>
                                </div>
                                <div className="card-content">
                                  <ul className="card-points triangle-list">
                                    {item?.levels?.map((level) => (
                                      <li key={level}>{level}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                              <div className="card-footer">&nbsp;</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="row">
                        <div className="col-sm-12">
                          <input
                            type="hidden"
                            name="llm_cert_level"
                            value="hipaa"
                          />
                          <input
                            type="hidden"
                            name="llm_destination"
                            value="production"
                          />
                          {/* {errorState?.show && (
                            <p style={{ color: "red" }}>{errorState?.message}</p>
                          )} */}
                          <div className="pull-right">
                            <button
                              type="button"
                              className="btn btn-info btn-xs btn-tcenter"
                              data-action="prev"
                              data-prev-pageid="4"
                              onClick={() => navigate('/wizard/machines')}
                            >
                              Back
                            </button>
                            <button
                              type="button"
                              className="btn btn-info btn-xs btn-tcenter"
                              data-action="certification"
                              data-id="s3"
                              onClick={handleNext}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
};

export default Mission;
