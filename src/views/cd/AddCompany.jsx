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
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const AddCompany = () => {
  const navigate = useNavigate()

  const [years, setYears] = useState([])
  const [year, setYear] = useState(null)
  const [updateYear, setUpdateYear] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [specificId, setSpecificId] = useState(null)
  const [specificYear, setSpecificYear] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
    }
  }, [])
  useEffect(() => {
    fetch('https://cd-backend-1.onrender.com/api/yearData/years')
      .then((response) => response.json())
      .then((data) => {
        setYears(data)
      })
  }, [])

  async function addYear() {
    event.preventDefault()
    const response = await fetch('https://cd-backend-1.onrender.com/api/yearData/years', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ year: Number(year) }),
    })
    if (!response.ok) {
      // window.prompt('Failed to add year')
      Swal.fire({
        icon: 'error',
        title: 'Failed to add',
        text: 'There was an error adding the year.',
      })
    } else {
      // window.prompt('success: Added year successfully')
      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: ' Added year successfully.',
      })

      setYear(null)
    }
  }
  async function saveSpecificYear() {
    const response = await fetch(
      `https://cd-backend-1.onrender.com/api/yearData/years/${specificId}`,
      {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ year: Number(updateYear) }),
      },
    )
    if (response.ok) {
      // window.prompt('success: Updated year successfully')
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: ' Updated year successfully.',
      })
      setUpdateYear(null)
      setShowModal(false)
    } else {
      // window.prompt('Failed: Failed to update year')
      Swal.fire({
        icon: 'error',
        title: 'Failed to update',
        text: 'There was an error updating the year.',
      })
      setUpdateYear(null)
    }
  }
  async function deleteSpecificYear(id, year) {
    const response = await fetch(`https://cd-backend-1.onrender.com/api/yearData/years/${id}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      // If the deletion is successful, show success alert
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Year deleted successfully.',
      })

      // Refresh the list of years
      fetchYears()
    } else {
      // Handle the error if the deletion fails
      Swal.fire({
        icon: 'error',
        title: 'Failed to delete',
        text: 'There was an error deleting the year.',
      })
    }
  }
  return (
    <>
      <form onSubmit={addYear}>
        <CRow>
          <CCol>
            <CFormInput
              type="number"
              name="year"
              placeholder="Add New Year"
              value={year || ''}
              onChange={(e) => setYear(Number(e.target.value))}
              required
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
                    <CTableHeaderCell scope="col">Years</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Edit</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {years.length > 0 ? (
                    years.map((year) => (
                      <CTableRow>
                        <CTableHeaderCell scope="row">{year.id}</CTableHeaderCell>
                        <CTableDataCell> {year.year} </CTableDataCell>
                        <CTableDataCell>
                          <FontAwesomeIcon
                            onClick={() => {
                              setSpecificYear(year.year)
                              setSpecificId(year.id)
                              setShowModal(true)
                            }}
                            icon={faPenToSquare}
                            style={{ color: '#997a0a', cursor: 'pointer' }}
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <FontAwesomeIcon
                            onClick={() => {
                              deleteSpecificYear(year.id, year.year)
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
              <h5 className="modal-title">Edit Year</h5>
              {/* <button type="button" className="close" onClick={() => setShowModal(false)}>
                <span>&times;</span>
              </button> */}
            </div>
            <div className="modal-body">
              <p>Edit the year: {specificYear}</p>
              <CFormInput
                type="number"
                name="year"
                placeholder="Update Year"
                value={updateYear || ''}
                onChange={(e) => setUpdateYear(Number(e.target.value))}
                required
              />
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
                  saveSpecificYear()
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

export default AddCompany
