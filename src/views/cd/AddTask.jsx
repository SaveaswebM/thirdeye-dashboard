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
import DatePicker from 'react-datepicker'
import { useNavigate } from 'react-router-dom'

import 'react-datepicker/dist/react-datepicker.css'
const AddTask = () => {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [years, setYears] = useState([])

  const [activities, setActivities] = useState([])
  const [taskName, setTaskName] = useState('')
  const [activityName, setActivityName] = useState('')
  const [activityType, setActivityType] = useState('')
  const [activityId, setActivityId] = useState(null)
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYearId, setSelectedYearId] = useState(null)

  const [selectedOption, setSelectedOption] = useState('')
  const [selectedOption2, setSelectedOption2] = useState('')
  const [startDate, setStartDate] = useState(new Date())

  const [year, setYear] = useState(null)
  const [updateYear, setUpdateYear] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [specificId, setSpecificId] = useState(null)
  const [specificActivity, setSpecificActivity] = useState('')
  const [activityNameEdit, setActivityNameEdit] = useState('')

  const [specificActivityId, setSpecificActivityId] = useState(null)

  const [specificActivityType, setSpecificActivityType] = useState('')
  const [specificTaskName, setSpecificTaskName] = useState('')
  const [specificDate, setSpecificDate] = useState('')
  const [specificYear, setSpecificYear] = useState('')
  const [specificYearId, setSpecificYearId] = useState(null)
  const [specificMonth, setSpecificMonth] = useState('')

  const [updateTaskName, setUpdateTaskName] = useState(specificTaskName)
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      navigate('/login')
    }
  }, [])
  useEffect(() => {
    fetch('https://cd-backend-1.onrender.com/api/activityData')
      .then((response) => response.json())
      .then((data) => {
        setTasks(data)
      })
  }, [])
  useEffect(() => {
    fetch('https://cd-backend-1.onrender.com/api/activity')
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          id: Number(item.id),
          label: item.name,
          value: item.name,
          type: item.type,
        }))

        setActivities(formattedOptions)
        console.log(data)
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [])
  useEffect(() => {
    fetch('https://cd-backend-1.onrender.com/api/yearData/years')
      .then((response) => response.json())
      .then((data) => {
        const formattedOptions = data.map((item) => ({
          id: Number(item.id),
          label: item.year,
          value: item.year,
        }))

        setYears(formattedOptions)
        console.log(data)
      })
      .catch((error) => console.error('Error fetching data:', error))
  }, [])
  async function addTask() {
    event.preventDefault()
    const response = await fetch('https://cd-backend-1.onrender.com/api/activityData', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        taskName: taskName,
        type: activityType,
        yearId: Number(selectedYearId),
        month: selectedMonth,
        dueDate: startDate,
        activityId: Number(activityId),
      }),
    })

    if (!response.ok) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to add',
        text: 'There was an error adding the Task.',
      })
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Added!',
        text: ' Added Task successfully.',
      })

      //   setYear(null)
    }
  }
  async function saveSpecificTask() {
    console.log('called')
    const response = await fetch(
      `https://cd-backend-1.onrender.com/api/activityData/${specificId}`,
      {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          taskName: specificTaskName,
          type: specificActivityType,
          yearId: Number(specificYearId),
          month: specificMonth,
          dueDate: specificDate,
          activityId: Number(specificActivityId),
        }),
      },
    )
    if (response.ok) {
      // window.prompt('success: Updated year successfully')
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: ' Updated Task successfully.',
      })
      setUpdateYear(null)
      setShowModal(false)
    } else {
      // window.prompt('Failed: Failed to update year')
      Swal.fire({
        icon: 'error',
        title: 'Failed to update',
        text: 'There was an error updating the Task.',
      })
      setUpdateYear(null)
    }
  }
  async function deleteSpecificTask(id) {
    const response = await fetch(`https://cd-backend-1.onrender.com/api/activityData/${id}`, {
      method: 'DELETE',
    })
    if (response.ok) {
      // If the deletion is successful, show success alert
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Task deleted successfully.',
      })

      // Refresh the list of years
      fetchYears()
    } else {
      // Handle the error if the deletion fails
      Swal.fire({
        icon: 'error',
        title: 'Failed to delete',
        text: 'There was an error deleting the Task.',
      })
    }
  }
  return (
    <>
      <form onSubmit={addTask}>
        <CRow>
          <CCol>
            <CFormInput
              type="text"
              name="Activity"
              placeholder="Add Task Name"
              value={taskName || ''}
              onChange={(e) => {
                setTaskName(e.target.value)
              }}
              required
            />
          </CCol>
          <CCol>
            {' '}
            <DatePicker
              showIcon
              selected={startDate}
              onChange={(date) => {
                const formattedDate = new Date(date).toISOString()
                setStartDate(formattedDate)
              }}
              required
            />
          </CCol>
          <CCol>
            <CFormSelect
              aria-label="select Activity Type"
              onChange={(e) => {
                const selectedOption = e.target.options[e.target.selectedIndex]
                setActivityName(e.target.value) // Activity name from value
                setActivityType(selectedOption.getAttribute('data-type')) // Activity type from data-type
                setActivityId(Number(selectedOption.getAttribute('data-id'))) // Activity id from data-id
              }}
              required
            >
              {activities.map((activity) => (
                <option
                  key={activity.id}
                  value={activity.value}
                  data-type={activity.type}
                  data-id={activity.id}
                >
                  {activity.label}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol>
            {' '}
            <CFormSelect
              aria-label="select year"
              onChange={(e) => {
                const selectedOption = e.target.options[e.target.selectedIndex]

                setSelectedYear(e.target.value)
                setSelectedYearId(Number(selectedOption.getAttribute('data-id')))
              }}
              required
            >
              {years.map((year) => (
                <option key={year.id} value={year.value} data-id={year.id}>
                  {year.label}
                </option>
              ))}
            </CFormSelect>
          </CCol>
          <CCol>
            {' '}
            <CFormSelect
              aria-label="select Month"
              options={[
                { label: 'January', value: 'January' },
                { label: 'February', value: 'February' },
                { label: 'March', value: 'March' },
                { label: 'April', value: 'April' },
                { label: 'May', value: 'May' },
                { label: 'June', value: 'June' },
                { label: 'July', value: 'July' },
                { label: 'August', value: 'August' },
                { label: 'September', value: 'September' },
                { label: 'October', value: 'October' },
                { label: 'November', value: 'November' },
                { label: 'December', value: 'December' },
              ]}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          </CCol>
          <CCol>
            <CButton color="primary" type="submit">
              Add Task
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
                    <CTableHeaderCell scope="col"> Task Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Due Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Activity Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Activity Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Year</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Month</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Edit</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <CTableRow>
                        <CTableHeaderCell scope="row">{task.id}</CTableHeaderCell>
                        <CTableDataCell> {task.taskName} </CTableDataCell>
                        <CTableDataCell>
                          {new Date(task.dueDate).toISOString().split('T')[0]}
                        </CTableDataCell>
                        <CTableDataCell> {task.activity.name} </CTableDataCell>
                        <CTableDataCell> {task.activity.type} </CTableDataCell>
                        <CTableDataCell> {task.year.year} </CTableDataCell>
                        <CTableDataCell> {task.month} </CTableDataCell>

                        <CTableDataCell>
                          <FontAwesomeIcon
                            onClick={() => {
                              setSpecificActivity(task.activity.name)
                              setSpecificActivityType(task.activity.type)
                              setSpecificActivityId(task.activity.id)
                              setSpecificId(task.id)
                              setSpecificTaskName(task.taskName)
                              setSpecificDate(task.dueDate)
                              setSpecificYear(task.year.year)
                              setSpecificYearId(task.year.id)
                              setSpecificMonth(task.month)
                              setShowModal(true)
                            }}
                            icon={faPenToSquare}
                            style={{ color: '#997a0a', cursor: 'pointer' }}
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <FontAwesomeIcon
                            onClick={() => {
                              deleteSpecificTask(task.id)
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
              <p>Edit Activity: {specificTaskName}</p>
              <CRow>
                <CCol>
                  <CRow>
                    <CCol>
                      <CFormInput
                        type="text"
                        name="Activity"
                        placeholder="Add Task Name"
                        value={specificTaskName || ''}
                        onChange={(e) => {
                          setSpecificTaskName(e.target.value)
                        }}
                        required
                      />
                    </CCol>
                  </CRow>
                </CCol>
                <CRow className="pt-4 pb-4">
                  <CCol>
                    {' '}
                    <DatePicker
                      showIcon
                      selected={specificDate}
                      onChange={(date) => {
                        const formattedDate = new Date(date).toISOString()
                        setSpecificDate(formattedDate)
                      }}
                      required
                    />
                  </CCol>
                  <CCol>
                    <CFormSelect
                      aria-label="select Activity Type"
                      value={specificActivity} // Set the selected value to specificTaskName
                      onChange={(e) => {
                        const selectedOption = e.target.options[e.target.selectedIndex]
                        setSpecificActivity(e.target.value) // Activity name from value
                        setSpecificActivityType(selectedOption.getAttribute('data-type')) // Activity type from data-type
                        setSpecificActivityId(Number(selectedOption.getAttribute('data-id'))) // Activity id from data-id
                      }}
                      required
                    >
                      {activities.map((activity) => (
                        <option
                          key={activity.id}
                          value={activity.value}
                          data-type={activity.type}
                          data-id={activity.id}
                        >
                          {activity.label}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>
                <CCol>
                  {' '}
                  <CFormSelect
                    aria-label="select year"
                    value={specificYear}
                    onChange={(e) => {
                      const selectedOption = e.target.options[e.target.selectedIndex]

                      setSpecificYear(e.target.value)
                      setSpecificYearId(Number(selectedOption.getAttribute('data-id')))
                    }}
                    required
                  >
                    {years.map((year) => (
                      <option key={year.id} value={year.value} data-id={year.id}>
                        {year.label}
                      </option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol>
                  {' '}
                  <CFormSelect
                    aria-label="select Month"
                    value={specificMonth}
                    options={[
                      { label: 'January', value: 'January' },
                      { label: 'February', value: 'February' },
                      { label: 'March', value: 'March' },
                      { label: 'April', value: 'April' },
                      { label: 'May', value: 'May' },
                      { label: 'June', value: 'June' },
                      { label: 'July', value: 'July' },
                      { label: 'August', value: 'August' },
                      { label: 'September', value: 'September' },
                      { label: 'October', value: 'October' },
                      { label: 'November', value: 'November' },
                      { label: 'December', value: 'December' },
                    ]}
                    onChange={(e) => setSpecificMonth(e.target.value)}
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
                  saveSpecificTask()
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

export default AddTask
