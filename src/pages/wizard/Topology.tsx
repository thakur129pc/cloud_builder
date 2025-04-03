/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiErrorResponse, ToplogyState } from '../../types/wizardTypes';
import axios, { AxiosError } from 'axios';
import { updateLoadingState } from '../../redux/wizardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from '../../redux/store';
import { API } from '../../apiconfig';
import ImageLoader from '../components/ImageLoader';
import DomainModal from '../components/DomainModal';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import ImageMagnifier from '../ImageMagnifier';

const Topology: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const WizardState = useSelector((state: ReduxState) => state.WizardSlice);

  const [topologyState, setTopologyState] = useState<ToplogyState | null>(null);

  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const [domain, setDomain] = useState('');

  const [domainResponse, setDomainResponse] = useState('');

  useEffect(() => {
    const fetchDiagram = async (compliance_id: number, level_id: number) => {
      try {
        dispatch(updateLoadingState(true));
        const response = await axios.post(
          API.API_CB + 'infrastructure/diagram',
          {
            compliance_id,
            level_id,
          }
        );
        const result = await response.data.data;
        setTopologyState(result);
        dispatch(updateLoadingState(false));
      } catch (err) {
        const error = err as AxiosError<ApiErrorResponse>;
        toast.error(error.response?.data.message || 'Internal server error');
        setTopologyState(null);
        dispatch(updateLoadingState(false));
      }
    };
    if (WizardState.selectedCert && WizardState.selectedLevel) {
      fetchDiagram(WizardState.selectedCert, WizardState.selectedLevel);
    }
  }, [WizardState.selectedCert]);

  const [imageLoading, setImageLoading] = useState(true);
  const handleImageLoaded = () => {
    setImageLoading(false);
  };

  const handleLaunch = () => {
    // navigate("/dashboard/dash")
    onOpenModal();
  };

  const handleVerifyDomain = async () => {
    try {
      if (domain) {
        const response = await axios.post(API.API_CB + 'verify-domain', {
          domain,
        });
        const result = await response.data;
        setDomainResponse(result.message);
      }
      if (domainResponse) {
        setLoading(true);
        setTimeout(() => {
          navigate('/dashboard');
          setLoading(false);
        }, 2000);
      }
    } catch (err) {
      setDomainResponse('');
      const error = err as AxiosError<ApiErrorResponse>;
      toast.error(error.response?.data.message || 'Internal server error');
    }
  };

  if (WizardState.loading) {
    return <ImageLoader />;
  } else
    return (
      <>
        <section className="main-section">
          <div className="content-wrapper">
            <div className="panel panel-default main-body">
              <div className="row">
                <div className="col-sm-12">
                  <div className="wizard" id="myWizard">
                    <div
                      className="step s7 topology-main topology-init-wrapper"
                      id="topology-screen"
                      data-type="wizard"
                      data-screen="s4"
                      style={{ display: 'block' }}
                    >
                      <div className="panel-heading">
                        <h4 className="panel-title">
                          Topology - <span className="chosen-level">hipaa</span>
                          <div className="pull-right">
                            <span className="destination-title-outer">
                              Destination -{' '}
                              <span className="chosen-destination">
                                production
                              </span>
                            </span>
                          </div>
                        </h4>
                      </div>
                      <div
                        className="panel-body panel-collapse collapse in"
                        aria-expanded="true"
                      >
                        <div
                          className="row"
                          data-choice="true"
                          data-mermaid-id="hipaa_production"
                          style={{ display: 'block' }}
                        >
                          <div className="col-sm-12">
                            <div
                              className="topology-img"
                              data-name="hipaa_production"
                              data-title="Hipaa"
                            >
                              {imageLoading && <p>Loading...</p>}
                              {topologyState?.diagram_link && (
                                <ImageMagnifier
                                  src={topologyState?.diagram_link}
                                  width={400}
                                  height={700}
                                  magnifierHeight={200}
                                  magnifierWidth={200}
                                  zoomLevel={2}
                                  alt="topology_image"
                                  onLoadFunction={handleImageLoaded}
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-sm-12">
                            <div className="pull-right save_btn_otr">
                              <button
                                type="button"
                                className="btn btn-info btn-xs btn-tcenter"
                                data-action="prev"
                                data-prev-pageid="6"
                                onClick={() => navigate('/wizard/costs')}
                              >
                                Back
                              </button>
                              <button
                                type="button"
                                className="btn btn-info btn-xs btn-tcenter"
                                id="launch-rokket"
                                // onClick={() => navigate("/dashboard/dash")}
                                onClick={handleLaunch}
                              >
                                {' '}
                                Verify Domain
                              </button>
                              <DomainModal
                                onOpenModal={onOpenModal}
                                onCloseModal={onCloseModal}
                                domain={domain}
                                setDomain={setDomain}
                                open={open}
                                domainResponse={domainResponse}
                                handleVerifyDomain={handleVerifyDomain}
                              />
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
        {loading && <Loader />}
      </>
    );
};

export default Topology;
