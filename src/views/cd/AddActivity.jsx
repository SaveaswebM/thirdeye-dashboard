import React, { useState, useEffect } from 'react'
import {
  CFormInput,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableRow,
  CTableBody,
  CTableDataCell,
  CCard,
  CCardHeader,
  CCardBody,
  CTableHeaderCell,
  CButton,
  CFormSelect,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
const AddActivity = () => {
  const navigate = useNavigate()
  const [activities, setActivities] = useState([])
  const [activityName, setActivityName] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [selectedOption2, setSelectedOption2] = useState('')

  const [year, setYear] = useState(null)
  const [updateYear, setUpdateYear] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [specificId, setSpecificId] = useState(null)
  const [specificActivity, setSpecificActivity] = useState('')
  const [activityNameEdit, setActivityNameEdit] = useState('')

  const [specificActivityType, setSpecificActivityType] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    fetch('https://cd-backend-1.onrender.com/api/activity')
      .then((response) => response.json())
      .then((data) => {
        setActivities(data)
      })
  }, [])

  async function addActivity() {
    event.preventDefault()
    const response = await fetch('https://cd-backend-1.onrender.com/api/activity', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ name: activityName, type: selectedOption }),
    })
    if (!response.ok) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to add',
        text: 'There was an error adding the activity.',
      })
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: ' Added activity successfully.',
      })

      //   setYear(null)
    }
  }
  async function saveSpecificActivity() {
    const response = await fetch(`https://cd-backend-1.onrender.com/api/activity/${specificId}`, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ name: activityNameEdit, type: selectedOption2 }),
    })
    if (response.ok) {
      // window.prompt('success: Updated year successfully')
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: ' Updated Activity successfully.',
      })
      setUpdateYear(null)
      setShowModal(false)
    } else {
      // window.prompt('Failed: Failed to update year')
      Swal.fire({
        icon: 'error',
        title: 'Failed to update',
        text: 'There was an error updating the Activity.',
      })
      setUpdateYear(null)
    }
  }
  async function deleteSpecificActivity(id) {
    const response = await fetch(`https://cd-backend-1.onrender.com/api/activity/${id}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      // If the deletion is successful, show success alert
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Activity deleted successfully.',
      })

      // Refresh the list of years
      fetchYears()
    } else {
      // Handle the error if the deletion fails
      Swal.fire({
        icon: 'error',
        title: 'Failed to delete',
        text: 'There was an error deleting the Activity.',
      })
    }
  }
  return (
    <>
      <form onSubmit={addActivity}>
        <CRow>
          <CCol>
            <CFormInput
              type="text"
              name="Activity"
              placeholder="Add New Activity"
              value={activityName || ''}
              onChange={(e) => setActivityName(e.target.value)}
              required
            />
          </CCol>
          <CCol>
            {' '}
            <CFormSelect
              aria-label="select Activity Type"
              options={[
                { label: 'Monthly', value: 'Monthly' },
                { label: 'Quarterly', value: 'Quarterly' },
                { label: 'Yearly', value: 'Yearly' },
              ]}
              onChange={(e) => setSelectedOption(e.target.value)}
            />
          </CCol>
          <CCol>
            <CButton color="primary" type="submit">
              Add Year
            </CButton>
          </CCol>
        </CRow>
      </form>
      <CRow className="pt-4">
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Years List</strong>
            </CCardHeader>
            <CCardBody>
              {/* <p className="text-body-secondary small">
                Using the most basic table CoreUI, here&#39;s how <code>&lt;CTable&gt;</code>-based
                tables look in CoreUI.
              </p> */}

              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">id</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Edit</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <CTableRow>
                        <CTableHeaderCell scope="row">{activity.id}</CTableHeaderCell>
                        <CTableDataCell> {activity.name} </CTableDataCell>
                        <CTableDataCell> {activity.type} </CTableDataCell>
                        <CTableDataCell>
                          <FontAwesomeIcon
                            onClick={() => {
                              setSpecificActivity(activity.name)
                              setSpecificActivityType(activity.type)
                              setSpecificId(activity.id)
                              setShowModal(true)
                            }}
                            icon={faPenToSquare}
                            style={{ color: '#997a0a', cursor: 'pointer' }}
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <FontAwesomeIcon
                            onClick={() => {
                              deleteSpecificActivity(activity.id)
                            }}
                            icon={faTrash}
                            style={{ color: '#d43535', cursor: 'pointer' }}
                          />{' '}
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={3} className="text-center">
                        No data available
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/* <div>
        <button
          onClick={() => {
            setShowModal(true)
          }}
        >
          hello
        </button>
      </div> */}
      <div
        className={`modal ${showModal ? 'show' : ''}`}
        style={{ display: showModal ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Activity</h5>
              {/* <button type="button" className="close" onClick={() => setShowModal(false)}>
                <span>&times;</span>
              </button> */}
            </div>
            <div className="modal-body">
              <p>Edit Activity: {specificActivity}</p>
              <CRow>
                <CCol>
                  {' '}
                  <CFormInput
                    type="text"
                    name="Activity"
                    placeholder="Add New Activity"
                    value={activityNameEdit || ''}
                    onChange={(e) => setActivityNameEdit(e.target.value)}
                    required
                  />
                </CCol>
                <CCol>
                  <CFormSelect
                    aria-label="select Activity Type"
                    options={[
                      { label: 'Monthly', value: 'Monthly' },
                      { label: 'Quarterly', value: 'Quarterly' },
                      { label: 'Yearly', value: 'Yearly' },
                    ]}
                    onChange={(e) => setSelectedOption2(e.target.value)}
                  />
                </CCol>
              </CRow>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  saveSpecificActivity()
                }}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddActivity
