import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import config from '../../config'


const CustomInput = ({ controlId, label, placeholder, value, onChange, as  }) => (
  <Form.Group className='customInputMain' controlId={controlId}>
    <Form.Label className='customInputLanel'>{label}</Form.Label>
    <Form.Control
      type="text"
      as={as && as}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target)}
    />
  </Form.Group>
);

const TokenomicsEditModal = ({ selectedCoinBot, showEditModal, setShowEditModal, selectedItemForEdit, fetchData }) => {

  const [tokenDistributionData, setTokenDistributionData] = useState({})
  const [tokenUtilityData, setTokenUtilityData] = useState({})
  const [valueAccrualMechanismsData, setValueAccrualMechanismsData] = useState({})

  // States for responsemessages
  const [responseMessage, setResponseMessage] = useState({'success': '', 'error': ''})

    // Get token distribution item
    const getTokenDistribution = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_token_distribution/${selectedItemForEdit.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          },
        );
        const data = await response.json();
        if (response.ok) {
          setTokenDistributionData(data.data)
        } else {
          console.log('token distri response:', data.error);
        }
      } catch (error) {
        console.error('Error fetching token distribution:', error);
      }
    };

    // Gets a token utility
    const getTokenUtility = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_token_utility/${selectedItemForEdit.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          },
        );
        const data = await response.json();
        if (response.ok) {
          setTokenUtilityData(data.data)
        } else {
          console.log('token utility response:', data.error);
        }
      } catch (error) {
        console.error('Error fetching token utility:', error);
      }
    };

    // Gets a value accrual mechanism
    const getValueAccrual = async () => {
      try {
        const response = await fetch(`${config.BASE_URL}/get_value_accrual/${selectedItemForEdit.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': 'true',
            },
          },
        );
        const data = await response.json();
        if (response.ok) {
          setValueAccrualMechanismsData(data.data)
        } else {
          console.log('value accrual response:', data.error);
        }
      } catch (error) {
        console.error('Error fetching value accrual:', error);
      }
    };
    
    // Gets the data of the selected item to edit
    useEffect(() => {
        if (selectedItemForEdit) {
          if (selectedItemForEdit.endpointName === 'token distribution') {
            getTokenDistribution();
          } else if (selectedItemForEdit.endpointName === 'token utility') {
            getTokenUtility();
          } else if (selectedItemForEdit.endpointName === 'value accrua mechanisms') {
            getValueAccrual();
          } else {
            console.error('Unknown endpointName:', selectedItemForEdit.endpointName);
          }
        } else {
          console.warn('No selectedItemForEdit');
        }
    }, [selectedItemForEdit]);

  // Handle the edit
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {

      const dataToSend = {
        token_distribution: {
          holder_category: tokenDistributionData.holder_category || '',
          percentage_held: tokenDistributionData.percentage_held || '',
        },
        token_utility: {
          token_application: tokenUtilityData.token_application || '',
          description: tokenUtilityData.description || '',
        },
        value_accrual_mechanisms: {
          mechanism: valueAccrualMechanismsData.mechanism || '',
          description: valueAccrualMechanismsData.description || '',
        },
      }

      const response = await fetch(`${config.BASE_URL}/edit_tokenomics/${selectedItemForEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(dataToSend),
      })
      const data = await response.json()

      if (response.ok){
        setResponseMessage({ success: data.message, error: '' });
        fetchData()
        setTimeout(() => {
          handleClose()
        }, 1200);
      } else {
        setResponseMessage({  error: data.error, success: '' });
      }
    } catch (error) {
      setResponseMessage({  error: error, success: '' });
    } 
  }

  const handleClose = () => {
    setShowEditModal(false)
    setTokenDistributionData({})
    setValueAccrualMechanismsData({})
    setTokenUtilityData({})
    setResponseMessage({'success': '', 'error': ''})
  }


  const handleTokenApplicationChange = ({id, value}) => {
    setTokenUtilityData({
      ...tokenUtilityData,
      [id]: value,
    })
  };

  const handleTokenDescriptionChange = ({id, value}) => {
    setTokenUtilityData({
      ...tokenUtilityData,
      [id]: value,
    })
  };

  const handleHolderCategoryChange = ({id, value}) => {
        setTokenDistributionData({
          ...tokenDistributionData,
          [id]: value,
        })
      };

  const handlePercentageHeldChange = ({id, value}) => {
        setTokenDistributionData({
          ...tokenDistributionData,
          [id]: value,
        })
      };

  const handleMechanismChange = ({id, value}) => {
        setValueAccrualMechanismsData({
          ...valueAccrualMechanismsData,
          [id]: value,
        })
      };
  const handleMechanismDescriptionChange = ({id, value}) => {
        setValueAccrualMechanismsData({
          ...valueAccrualMechanismsData,
          [id]: value,
        })
      };

console.log(responseMessage)

  return (
    <Modal show={showEditModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title className='editModalTitle'>{selectedItemForEdit && selectedItemForEdit.endpointName} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className='modalFormGNR' onSubmit={handleSubmit}>
        {/* Token Utility Form */}
        {
          selectedItemForEdit && selectedItemForEdit.endpointName === 'token utility' && (
          <div>
            <CustomInput
            controlId="token_application"
            label="Token Application"
            placeholder="Enter token application"
            value={tokenUtilityData.token_application || ''}
            onChange={handleTokenApplicationChange}
            />
            <CustomInput
            controlId="description"
            label="Token Description"
            as="textarea"
            placeholder="Enter token description"
            value={tokenUtilityData.description || ''}
            onChange={handleTokenDescriptionChange}
            />
          </div>
          )
        }
        
        {/* Token Distribution Form */}
        {
          selectedItemForEdit && selectedItemForEdit.endpointName === 'token distribution' && (
          <div>
            <CustomInput
            controlId="holder_category"
            label="Holder Category"
            placeholder="Enter holder category"
            value={tokenDistributionData.holder_category || ''}
            onChange={handleHolderCategoryChange}
            />
            <CustomInput
            controlId="percentage_held"
            label="Percentage Held"
            placeholder="Enter token description"
            value={tokenDistributionData.percentage_held || ''}
            onChange={handlePercentageHeldChange}
            />
          </div>
          )
        }
        
        {/* Value Accrual Mechanisms Form */}
        {
          selectedItemForEdit && selectedItemForEdit.endpointName === 'value accrua mechanisms' && (
          <div>
            <CustomInput
            controlId="mechanism"
            label="Mechanism in place"
            placeholder="Enter mechanism"
            value={valueAccrualMechanismsData.mechanism || ''}
            onChange={handleMechanismChange}
            />
            <CustomInput
            controlId="description"
            label="Description"
            as='textarea'
            placeholder="Enter mechanism description"
            value={valueAccrualMechanismsData.description || ''}
            onChange={handleMechanismDescriptionChange}
            />
          </div>
          )
        }

        <Button className='modalFormBtn' style={{ width: "100%" }} variant="primary" type="submit">
          Submit
        </Button>
       
        {responseMessage.success && <Alert className='alertGeneral' variant="success">{responseMessage.success}</Alert>}
      {responseMessage.error && <Alert className='alertGeneral' variant="danger">{responseMessage.error}</Alert>}
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default TokenomicsEditModal
