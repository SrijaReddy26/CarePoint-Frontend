import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Search,
  Plus,
  Pencil,
  Trash2,
  Users,
  CalendarDays,
  Stethoscope,
  HeartPulse,
  X,
  CheckCircle2,
  LayoutDashboard,
  Building2,
  ArrowRight,
  Clock
} from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const emptyForm = {
  name: '',
  age: '',
  gender: 'Female',
  phone: '',
  department: 'General Medicine',
  doctor: '',
  visitDate: new Date().toISOString().slice(0, 10),
  status: 'Scheduled'
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'patients', label: 'Patient Management', icon: Users },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'appointments', label: 'Appointments', icon: CalendarDays },
  { id: 'departments', label: 'Departments', icon: Building2 }
]

const pageTitles = {
  dashboard: 'Dashboard',
  patients: 'Patient Management',
  doctors: 'Doctors',
  appointments: 'Appointments',
  departments: 'Departments'
}

function Dashboard({ patients, onNavigate }) {
  useEffect(() => {
  fetch(`${API}/doctors`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to load doctors')
      return response.json()
    })
    .then(data => setDoctors(data))
    .catch(error => console.error('Doctors:', error))

  fetch(`${API}/appointments`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to load appointments')
      return response.json()
    })
    .then(data => setAppointments(data))
    .catch(error => console.error('Appointments:', error))

  fetch(`${API}/departments`)
    .then(response => {
      if (!response.ok) throw new Error('Failed to load departments')
      return response.json()
    })
    .then(data => setDepartmentList(data))
    .catch(error => console.error('Departments:', error))
}, [])
  const today = new Date().toISOString().slice(0, 10)
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [departmentList, setDepartmentList] = useState([])

  const departments = departmentList.length
const totalDoctors = doctors.length
const totalAppointments = appointments.length
const upcomingAppointments = appointments
  .filter(appointment =>
    appointment.appointmentDate >= today &&
    appointment.status === 'Scheduled'
  )
  .sort((a, b) =>
    `${a.appointmentDate} ${a.appointmentTime || ''}`.localeCompare(
      `${b.appointmentDate} ${b.appointmentTime || ''}`
    )
  )
  .slice(0, 5)

  const todayAppointments = appointments.filter(
  appointment =>
    appointment.appointmentDate === today &&
    appointment.status !== 'Cancelled'
).length
  const scheduled = patients.filter(
    patient => patient.status === 'Scheduled'
  ).length

  const recentPatients = [...patients]
    .reverse()
    .slice(0, 5)

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">
            <Activity size={15} /> HOSPITAL OPERATIONS
          </div>
          <h1>Dashboard</h1>
          <p className="subheading">
            Welcome to CarePoint. Here's your hospital overview.
          </p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon teal">
            <Users size={20} />
          </div>
          <div className="stat-copy">
            <span>Total patients</span>
            <strong>{patients.length}</strong>
            <small>Saved patient records</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <CalendarDays size={20} />
          </div>
          <div className="stat-copy">
            <span>Today's appointments</span>
            <strong>{todayAppointments}</strong>
            <small>From appointment records</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <Stethoscope size={20} />
          </div>
          
            <span>Scheduled visits</span>
            <strong>{scheduled}</strong>
            <small>Marked as scheduled</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon teal">
            <Building2 size={20} />
          </div>
          <div className="stat-copy">
            <span>Departments</span>
            <strong>{departments}</strong>
            <small>Registered hospital departments</small>
          </div>
                  <div className="stat-card">
          <div className="stat-icon purple">
            <CalendarDays size={20} />
          </div>
          <div className="stat-copy">
            <span>Total appointments</span>
            <strong>{totalAppointments}</strong>
            <small>All appointment records</small>
          </div>
        </div>
        </div>
        <div className="stat-copy">
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Recent patients</h2>
            <p>Your latest patient records.</p>
          </div>
          <button
            className="secondary-btn"
            onClick={() => onNavigate('patients')}
          >
            View patients <ArrowRight size={16} />
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>PATIENT</th>
                <th>DEPARTMENT</th>
                <th>DOCTOR</th>
                <th>VISIT DATE</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {recentPatients.map(patient => (
                <tr key={patient.id}>
                  <td>
                    <div className="patient-cell">
                      <div className="patient-avatar">
                        {patient.name
                          ?.split(' ')
                          .map(part => part[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()}
                      </div>
                      <div>
                        <b>{patient.name}</b>
                        <span>{patient.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td>{patient.department}</td>
                  <td>{patient.doctor}</td>
                  <td>{patient.visitDate || '—'}</td>
                  <td>
                    <span
                      className={`status ${
                        patient.status?.toLowerCase().replaceAll(' ', '-')
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                </tr>
              ))}

              {patients.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">
                      <Users size={28} />
                      <b>No patient records yet</b>
                      <span>Add a patient to see records here.</span>
                      <button
                        className="primary-btn small"
                        onClick={() => onNavigate('patients')}
                      >
                        <Plus size={16} /> Add patient
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="panel-footer">
          Statistics are based on records returned by your Spring Boot API.
        </div>
      </section>
      
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Upcoming appointments</h2>
            <p>Your next scheduled patient visits.</p>
          </div>
          <button
            className="secondary-btn"
            onClick={() => onNavigate('appointments')}
          >
            View appointments <ArrowRight size={16} />
          </button>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={28} />
            <b>No upcoming appointments</b>
            <span>Scheduled appointments will appear here.</span>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>PATIENT</th>
                  <th>DOCTOR</th>
                  <th>DATE</th>
                  <th>TIME</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.doctorName}</td>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.appointmentTime || '—'}</td>
                    <td>
                      <span className="status scheduled">
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Quick access</h2>
            <p>Navigate to a hospital management section.</p>
          </div>
        </div>

        <div className="stats-grid">
          <button
            className="stat-card"
            onClick={() => onNavigate('patients')}
            >
            <div className="stat-icon teal">
              <Users size={20} />
            </div>
            <div className="stat-copy">
              <span>Patients</span>
              <small>Manage patient records</small>
            </div>
            <ArrowRight size={18} />
          </button>

          <button
            className="stat-card"
            onClick={() => onNavigate('doctors')}
          >
            <div className="stat-icon blue">
              <Stethoscope size={20} />
            </div>
            <div className="stat-copy">
              <span>Doctors</span>
              <small>Open doctor management</small>
            </div>
            <ArrowRight size={18} />
          </button>

          <button
            className="stat-card"
            onClick={() => onNavigate('appointments')}
          >
            <div className="stat-icon purple">
              <CalendarDays size={20} />
            </div>
            <div className="stat-copy">
              <span>Appointments</span>
    
            </div>
            <ArrowRight size={18} />
          </button>

          <button
            className="stat-card"
            onClick={() => onNavigate('departments')}
          >
            <div className="stat-icon teal">
              <Building2 size={20} />
            </div>
            <div className="stat-copy">
              <span>Departments</span>
              <small>Open department management</small>
            </div>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </>
  )
}

function DoctorManagement() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const emptyDoctor = {
    name: '',
    specialization: '',
    department: 'General Medicine',
    phone: '',
    email: '',
    experience: 0,
    availability: 'Available'
  }

  const [form, setForm] = useState(emptyDoctor)

  async function loadDoctors() {
    try {
      setError('')
      const response = await fetch(`${API}/doctors`)
      if (!response.ok) throw new Error('Could not load doctors.')
      setDoctors(await response.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDoctors()
  }, [])

  function openCreate() {
    setEditingId(null)
    setForm({ ...emptyDoctor })
    setShowForm(true)
    setError('')
    setNotice('')
  }

  function openEdit(doctor) {
    setEditingId(doctor.id)
    setForm({
      name: doctor.name || '',
      specialization: doctor.specialization || '',
      department: doctor.department || 'General Medicine',
      phone: doctor.phone || '',
      email: doctor.email || '',
      experience: doctor.experience ?? 0,
      availability: doctor.availability || 'Available'
    })
    setShowForm(true)
    setError('')
    setNotice('')
  }

  function change(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  async function saveDoctor(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    try {
      const response = await fetch(
        editingId
          ? `${API}/doctors/${editingId}`
          : `${API}/doctors`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            experience: Number(form.experience)
          })
        }
      )

      if (!response.ok) throw new Error('Could not save doctor.')

      setShowForm(false)
      setNotice(editingId ? 'Doctor updated.' : 'Doctor added successfully.')
      setLoading(true)
      await loadDoctors()
    } catch (e) {
      setError(e.message)
    }
  }

  async function deleteDoctor(doctor) {
    if (!window.confirm(`Delete Dr. ${doctor.name}?`)) return

    try {
      setError('')
      const response = await fetch(`${API}/doctors/${doctor.id}`, {
        method: 'DELETE'
      })

      
if (!response.ok) throw new Error('Could not delete doctor.')

      setNotice('Doctor deleted.')
      setLoading(true)
      await loadDoctors()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">
            <Activity size={15} /> HOSPITAL OPERATIONS
          </div>
          <h1>Doctor Management</h1>
          <p className="subheading">
            Register doctors and manage their professional details.
          </p>
        </div>

        <button className="primary-btn" onClick={openCreate}>
          <Plus size={18} /> Add doctor
        </button>
      </div>

      {notice && <div className="notice">{notice}</div>}
      {error && <div className="error-box">{error}</div>}

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Doctor directory</h2>
            <p>View, register, update, or remove doctor records.</p>
          </div>
          <button
            className="secondary-btn"
            onClick={() => {
              setLoading(true)
              loadDoctors()
            }}
          >
            Refresh
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>DOCTOR</th>
                <th>SPECIALIZATION</th>
                <th>DEPARTMENT</th>
                <th>PHONE</th>
                <th>EXPERIENCE</th>
                <th>AVAILABILITY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7">Loading doctors...</td></tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      <Stethoscope size={28} />
                      <b>No doctors registered yet</b>
                      <span>Add your first doctor to get started.</span>
                      <button
                        className="primary-btn small"
                        onClick={openCreate}
                      >
                        <Plus size={16} /> Add doctor
                      </button>
                    </div>
                  </td>
                </tr>
              ) : doctors.map(doctor => (
                <tr key={doctor.id}>
                  <td>
                    <div className="patient-cell">
                      <div className="patient-avatar">
                        {doctor.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div>
                        <b>{doctor.name}</b>
                        <span>{doctor.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{doctor.specialization}</td>
                  <td>{doctor.department}</td>
                  <td>{doctor.phone}</td>
                  <td>{doctor.experience} years</td>
                  <td>{doctor.availability}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="icon-btn edit"
                        onClick={() => openEdit(doctor)}
                        title="Edit doctor"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => deleteDoctor(doctor)}
                        title="Delete doctor"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <div className="modal-backdrop">
          <section className="modal">
            <div className="modal-heading">
              <div>
                <span className="eyebrow">
                  {editingId ? 'EDIT DOCTOR' : 'NEW DOCTOR'}
                </span>
                <h2>{editingId ? 'Update doctor' : 'Register a doctor'}</h2>
              </div>
              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveDoctor}>
              <div className="form-grid">
                <label className="full">
                  Full name
                  <input name="name" value={form.name}
                    onChange={change} required maxLength="100" />
                </label>
                <label>
                  Specialization
                  <input name="specialization"
                    value={form.specialization} onChange={change} required />
                </label>
                <label>
                  Department
                  <select name="department" value={form.department}
                    onChange={change}>
                    <option>General Medicine</option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>Orthopedics</option>
                    <option>Pediatrics</option>
                    <option>Dermatology</option>
                    <option>Emergency</option>
                    <option>ENT</option>
                    <option>Ophthalmology</option>
                  </select>
                </label>
                <label>
                  Phone
                  <input name="phone" value={form.phone}
                    onChange={change} required maxLength="20" />
                </label>
                <label>
                  Email
                  <input name="email" type="email" value={form.email}
                    onChange={change} required />
                </label>
                <label>
                  Experience (years)
                  <input name="experience" type="number" min="0"
                    max="70" value={form.experience} onChange={change} required />
                </label>
                <label>
                  Availability
                  <select name="availability" value={form.availability}
                    onChange={change}>
                    <option>Available</option>
                    <option>Unavailable</option>
                    <option>On Leave</option>
                  </select>
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="secondary-btn"
                  onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button className="primary-btn">
                  {editingId ? 'Save changes' : 'Register doctor'}
                  <CheckCircle2 size={17} />
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  )
}

function AppointmentManagement() {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const emptyForm = {
    patientName: '',
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    status: 'Scheduled'
  }

  const [form, setForm] = useState(emptyForm)

  async function loadAppointments() {
    try {
      const response = await fetch(`${API}/appointments`)
      if (!response.ok) throw new Error('Could not load appointments')
      setAppointments(await response.json())
      setError('')
    } catch {
      setError('Unable to load appointments. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  async function loadOptions() {
    try {
      const [patientResponse, doctorResponse] = await Promise.all([
        fetch(`${API}/patients`),
        fetch(`${API}/doctors`)
      ])

      if (patientResponse.ok) setPatients(await patientResponse.json())
      if (doctorResponse.ok) setDoctors(await doctorResponse.json())
    } catch {
      // The form also allows names to be entered manually.
    }
  }

  useEffect(() => {
    loadAppointments()
    loadOptions()
  }, [])

  function openCreate() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(true)
    setError('')
    setNotice('')
  }

  function openEdit(appointment) {
    setForm({
      patientName: appointment.patientName || '',
      doctorName: appointment.doctorName || '',
      appointmentDate: appointment.appointmentDate || '',
      appointmentTime: appointment.appointmentTime || '',
      reason: appointment.reason || '',
      status: appointment.status || 'Scheduled'
    })
    setEditingId(appointment.id)
    setShowForm(true)
    setError('')
    setNotice('')
  }

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function saveAppointment(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    try {
      const response = await fetch(
        editingId
          ? `${API}/appointments/${editingId}`
          : `${API}/appointments`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        }
      )

      if (!response.ok) throw new Error('Save failed')

      setShowForm(false)
      setNotice(editingId ? 'Appointment updated.' : 'Appointment booked.')
      await loadAppointments()
    } catch {
      setError('Could not save the appointment. Please check the backend.')
    }
  }

  async function deleteAppointment(id) {
    if (!window.confirm('Delete this appointment?')) return

    try {
      const response = await fetch(`${API}/appointments/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Delete failed')
      setNotice('Appointment deleted.')
      await loadAppointments()
    } catch {
      setError('Could not delete the appointment.')
    }
  }

  return (
    <section className="page-content">
      <div className="welcome-row">
        <div>
          <h2>Appointment Management</h2>
          <p>Book and manage hospital appointments.</p>
        </div>
        <button className="primary-button" onClick={openCreate}>
          <Plus size={16} /> Book appointment
        </button>
      </div>

      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}

      <div className="panel">
        <div className="panel-header">
          <h3>Appointments</h3>
          <span>{appointments.length} total</span>
        </div>

        {loading ? (
          <p>Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p>No appointments yet. Click "Book appointment" to add one.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.id}</td>
                    <td>{appointment.patientName}</td>
                    <td>{appointment.doctorName}</td>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.appointmentTime}</td>
                    <td>{appointment.reason}</td>
                    <td>{appointment.status}</td>
                    <td>
                      <button onClick={() => openEdit(appointment)}>
                        Edit
                      </button>
                      {' '}
                      <button onClick={() => deleteAppointment(appointment.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingId ? 'Edit appointment' : 'Book appointment'}</h3>

            <form onSubmit={saveAppointment}>
              <label>Patient</label>
              <input
                list="patient-options"
                name="patientName"
                value={form.patientName}
                onChange={change}
                placeholder="Enter patient name"
                required
              />
              <datalist id="patient-options">
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.name} />
                ))}
              </datalist>

              <label>Doctor</label>
              <input
                list="doctor-options"
                name="doctorName"
                value={form.doctorName}
                onChange={change}
                placeholder="Enter doctor name"
                required
              />
              <datalist id="doctor-options">
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.name} />
                ))}
              </datalist>

              <label>Date</label>
              <input
                type="date"
                name="appointmentDate"
                value={form.appointmentDate}
                onChange={change}
                required
              />

              <label>Time</label>
              <input
                type="time"
                name="appointmentTime"
                value={form.appointmentTime}
                onChange={change}
                required
              />

              <label>Reason for visit</label>
              <input
                name="reason"
                value={form.reason}
                onChange={change}
                placeholder="Reason for appointment"
                required
              />

              <label>Status</label>
              <select
                name="status"
                value={form.status}
                onChange={change}
                required
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit">
                  {editingId ? 'Save changes' : 'Book appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

function DepartmentManagement() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const emptyDepartment = {
    name: '',
    description: '',
    location: '',
    headOfDepartment: '',
    phone: ''
  }

  const [form, setForm] = useState(emptyDepartment)

  async function loadDepartments() {
    try {
      const response = await fetch(`${API}/departments`)
      if (!response.ok) throw new Error('Could not load departments')
      setDepartments(await response.json())
      setError('')
    } catch {
      setError('Unable to load departments. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDepartments()
  }, [])

  function openCreate() {
    setForm({ ...emptyDepartment })
    setEditingId(null)
    setShowForm(true)
    setError('')
    setNotice('')
  }

  function openEdit(department) {
    setForm({
      name: department.name || '',
      description: department.description || '',
      location: department.location || '',
      headOfDepartment: department.headOfDepartment || '',
      phone: department.phone || ''
    })
    setEditingId(department.id)
    setShowForm(true)
    setError('')
    setNotice('')
  }

  function change(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function saveDepartment(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    try {
      const response = await fetch(
        editingId
          ? `${API}/departments/${editingId}`
          : `${API}/departments`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        }
      )

      if (!response.ok) throw new Error('Save failed')

      setShowForm(false)
      setNotice(editingId ? 'Department updated successfully.' : 'Department added successfully.')
      await loadDepartments()
    } catch {
      setError('Could not save department. Please check the backend.')
    }
  }

  async function deleteDepartment(id) {
    if (!window.confirm('Are you sure you want to delete this department?')) {
      return
    }

    setError('')
    setNotice('')

    try {
      const response = await fetch(`${API}/departments/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Delete failed')

      setNotice('Department deleted successfully.')
      await loadDepartments()
    } catch {
      setError('Could not delete department.')
    }
  }

  return (
    <section className="page-content">
      <div className="welcome-row">
        <div>
          <h2>Department Management</h2>
          <p>Manage hospital departments and their details.</p>
        </div>
        <button className="primary-button" onClick={openCreate}>
          <Plus size={16} /> Add department
        </button>
      </div>

      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}

      <div className="panel">
        <div className="panel-header">
          <h3>Hospital Departments</h3>
          <span>{departments.length} total</span>
        </div>

        {loading ? (
          <p>Loading departments...</p>
        ) : departments.length === 0 ? (
          <p>No departments yet. Click "Add department" to create one.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Department Head</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department) => (
                  <tr key={department.id}>
                    <td>{department.id}</td>
                    <td>{department.name}</td>
                    <td>{department.description}</td>
                    <td>{department.location}</td>
                    <td>{department.headOfDepartment}</td>
                    <td>{department.phone}</td>
                    <td>
                      <button onClick={() => openEdit(department)}>
                        Edit
                      </button>
                      {' '}
                      <button onClick={() => deleteDepartment(department.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editingId ? 'Edit department' : 'Add department'}</h3>

            <form onSubmit={saveDepartment}>
              <label>Department name</label>
              <input
                name="name"
                value={form.name}
                onChange={change}
                placeholder="e.g. Cardiology"
                required
              />

              <label>Description</label>
              <input
                name="description"
                value={form.description}
                onChange={change}
                placeholder="Department description"
                required
              />

              <label>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={change}
                placeholder="e.g. First floor"
                required
              />

              <label>Head of department</label>
              <input
                name="headOfDepartment"
                value={form.headOfDepartment}
                onChange={change}
                placeholder="Department head's name"
                required
              />

              <label>Phone</label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={change}
                placeholder="Department phone number"
                required
              />

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit">
                  {editingId ? 'Save changes' : 'Add department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

function ComingSoon({ page, onNavigate }) {
  const details = {
    doctors: {
      icon: Stethoscope,
      title: 'Doctor Management',
      description:
        'This section will let you register doctors and manage their details.'
    },
    appointments: {
      icon: CalendarDays,
      title: 'Appointment Management',
      description:
        'This section will let you schedule and manage patient appointments.'
    },
    departments: {
      icon: Building2,
      title: 'Department Management',
      description:
        'This section will let you manage hospital departments.'
    }
  }

  const item = details[page]
  const Icon = item.icon

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">
            <Activity size={15} /> HOSPITAL OPERATIONS
          </div>
          <h1>{item.title}</h1>
          <p className="subheading">{item.description}</p>
        </div>
      </div>

      <section className="panel">
        <div className="empty-state">
          <Icon size={36} />
          <b>{item.title} is our next module</b>
          <span>
            The navigation is ready. We'll implement the forms, backend
            endpoints and database operations in the next steps.
          </span>
          <button
            className="primary-btn"
            onClick={() => onNavigate('dashboard')}
          >
            <LayoutDashboard size={17} />
            Back to Dashboard
          </button>
        </div>
      </section>
    </>
  )
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [patients, setPatients] = useState([])
  const [search, setSearch] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  async function loadPatients(term = search) {
    try {
      setError('')

      const url = term.trim()
        ? `${API}/patients?search=${encodeURIComponent(term.trim())}`
        : `${API}/patients`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Could not load patients. Is the backend running?')
      }

      setPatients(await response.json())
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    loadPatients('')
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => loadPatients(search), 250)
    return () => clearTimeout(timer)
  }, [search])

  const stats = useMemo(() => ({
    total: patients.length,
    scheduled: patients.filter(p => p.status === 'Scheduled').length,
    departments: new Set(
      patients.map(p => p.department).filter(Boolean)
    ).size
  }), [patients])

  function navigate(page) {
    setActivePage(page)
    setNotice('')
    setError('')

    if (page !== 'patients') {
      setShowForm(false)
    }
  }

  function openCreate() {
    setEditingId(null)
    setForm({ ...emptyForm })
    setShowForm(true)
    setNotice('')
    setError('')
  }

  function openEdit(patient) {
    setEditingId(patient.id)
    setForm({
      ...patient,
      age: String(patient.age),
      visitDate: patient.visitDate || ''
    })
    setShowForm(true)
    setNotice('')
    setError('')
  }

  function change(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  async function savePatient(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setNotice('')

    const payload = {
      ...form,
      age: Number(form.age)
    }

    try {
      const response = await fetch(
        editingId
          ? `${API}/patients/${editingId}`
          : `${API}/patients`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        const body = await response.text()
        throw new Error(body || 'Unable to save patient. Check the form.')
      }

      setShowForm(false)
      setNotice(
        editingId
          ? 'Patient details updated.'
          : 'Patient added successfully.'
      )

      await loadPatients(search)
    } catch (e) {
      setError(
        `${e.message} Make sure the Spring Boot backend is running on port 8080.`
      )
    } finally {
      setBusy(false)
    }
  }

  async function deletePatient(patient) {
    if (!window.confirm(`Delete patient record for ${patient.name}?`)) {
      return
    }

    try {
      setError('')

      const response = await fetch(
        `${API}/patients/${patient.id}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        throw new Error('Unable to delete patient.')
      }

      setNotice('Patient record deleted.')
      await loadPatients(search)
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <HeartPulse size={24} />
          </div>
          <div>
            <strong>CarePoint</strong>
            <span>HOSPITAL SYSTEM</span>
          </div>
        </div>

        <div className="side-label">WORKSPACE</div>

        {navigation.map(item => {
          const Icon = item.icon

          return (
            <div
              key={item.id}
              className={`nav-item ${
                activePage === item.id ? 'active' : ''
              }`}
              onClick={() => navigate(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  navigate(item.id)
                }
              }}
            >
              <Icon size={18} />
              {item.label}
            </div>
          )
        })}

        <div className="sidebar-bottom">
          <div className="online-dot"></div>
          <div>
            <b>System status</b>
            <span>Local workspace</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span>{' '}
            <b>{pageTitles[activePage]}</b>
          </div>

          <div className="profile">
            <div className="avatar">AD</div>
            <div>
              <b>Administrator</b>
              <span>Hospital staff</span>
            </div>
          </div>
        </header>

        <section className="page-content">
          {notice && (
            <div className="notice">
              <CheckCircle2 size={17} />
              {notice}
              <button
                onClick={() => setNotice('')}
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {error && <div className="error-box">{error}</div>}

          {activePage === 'dashboard' && (
            <Dashboard
              patients={patients}
              onNavigate={navigate}
            />
          )}

          {activePage === 'patients' && (
            <>
              <div className="welcome-row">
                <div>
                  <div className="eyebrow">
                    <Activity size={15} /> HOSPITAL OPERATIONS
                  </div>
                  <h1>Patient management</h1>
                  <p className="subheading">
                    Manage patient records and keep care moving forward.
                  </p>
                </div>

                <button
                  className="primary-btn"
                  onClick={openCreate}
                >
                  <Plus size={18} /> Add patient
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon teal">
                    <Users size={20} />
                  </div>
                  <div className="stat-copy">
                    <span>Total patients</span>
                    <strong>{stats.total}</strong>
                    <small>Records in this view</small>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon blue">
                    <CalendarDays size={20} />
                  </div>
                  
                    <div className="stat-copy">
                      <span>Total doctors</span>
                      <strong>{totalDoctors}</strong>
                      <small>Registered doctors</small>
                </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon purple">
                    <Stethoscope size={20} />
                  </div>
                  <div className="stat-copy">
                    <span>Departments</span>
                    <strong>{stats.departments}</strong>
                    <small>Across patient records</small>
                  </div>
                </div>
              </div>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Patient directory</h2>
                    <p>
                      View, search, update, or remove patient records.
                    </p>
                  </div>
                  <div className="result-count">
                    {patients.length} records
                  </div>
                </div>

                <div className="toolbar">
                  <div className="search-box">
                    <Search size={18} />
                    <input
                      value={search}
                      onChange={event => setSearch(event.target.value)}
                      placeholder="Search name, phone, department..."
                    />
                  </div>

                  <button
                    className="secondary-btn"
                    onClick={() => loadPatients(search)}
                  >
                    Refresh
                  </button>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>PATIENT</th>
                        <th>AGE / GENDER</th>
                        <th>DEPARTMENT</th>
                        <th>DOCTOR</th>
                        <th>VISIT DATE</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {patients.map(patient => (
                        <tr key={patient.id}>
                          <td>
                            <div className="patient-cell">
                              <div className="patient-avatar">
                                {patient.name
                                  ?.split(' ')
                                  .map(part => part[0])
                                  .slice(0, 2)
                                  .join('')
                                  .toUpperCase()}
                              </div>
                              <div>
                                <b>{patient.name}</b>
                                <span>{patient.phone}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            {patient.age} / {patient.gender}
                          </td>
                          <td>{patient.department}</td>
                          <td>{patient.doctor}</td>
                          <td>{patient.visitDate || '—'}</td>

                          <td>
                            <span
                              className={`status ${
                                patient.status
                                  ?.toLowerCase()
                                  .replaceAll(' ', '-')
                              }`}
                            >
                              {patient.status}
                            </span>
                          </td>

                          <td>
                            <div className="actions">
                              <button
                                className="icon-btn edit"
                                onClick={() => openEdit(patient)}
                                title="Edit patient"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                className="icon-btn delete"
                                onClick={() => deletePatient(patient)}
                                title="Delete patient"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {!patients.length && (
                        <tr>
                          <td colSpan="7">
                            <div className="empty-state">
                              <Users size={28} />
                              <b>No patient records found</b>
                              <span>
                                {search
                                  ? 'Try a different search term.'
                                  : 'Add your first patient to get started.'}
                              </span>

                              {!search && (
                                <button
                                  className="primary-btn small"
                                  onClick={openCreate}
                                >
                                  <Plus size={16} /> Add patient
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="panel-footer">
                  Patient information is stored by your local Spring Boot API.
                </div>
              </section>
            </>
          )}
          {activePage === 'doctors' && <DoctorManagement />}

          {activePage === 'appointments' && <AppointmentManagement />}

          {activePage === 'departments' && <DepartmentManagement />}
           
          <footer>
            CarePoint Hospital Management <span>•</span> Java Full Stack Project
          </footer>
        </section>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setShowForm(false)
            }
          }}
        >
          <section className="modal">
            <div className="modal-heading">
              <div>
                <span className="eyebrow">
                  {editingId ? 'EDIT RECORD' : 'NEW RECORD'}
                </span>
                <h2>
                  {editingId ? 'Update patient' : 'Add a patient'}
                </h2>
                <p>Enter the patient's details below.</p>
              </div>

              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={savePatient}>
              <div className="form-grid">
                <label className="full">
                  Full name
                  <input
                    name="name"
                    value={form.name}
                    onChange={change}
                    required
                    maxLength="100"
                    placeholder="Patient full name"
                  />
                </label>

                <label>
                  Age
                  <input
                    name="age"
                    type="number"
                    min="0"
                    max="120"
                    value={form.age}
                    onChange={change}
                    required
                    placeholder="Age"
                  />
                </label>

                <label>
                  Gender
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={change}
                  >
                    <option>Female</option>
                    <option>Male</option>
                    <option>Other</option>
                    <option>Prefer not to say</option>
                  </select>
                </label>

                <label>
                  Phone number
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={change}
                    required
                    maxLength="20"
                    placeholder="Contact number"
                  />
                </label>

                <label>
                  Department
                  <select
                    name="department"
                    value={form.department}
                    onChange={change}
                  >
                    <option>General Medicine</option>
                    <option>Cardiology</option>
                    <option>Neurology</option>
                    <option>Orthopedics</option>
                    <option>Pediatrics</option>
                    <option>Dermatology</option>
                    <option>Emergency</option>
                    <option>ENT</option>
                    <option>Ophthalmology</option>
                  </select>
                </label>

                <label>
                  Doctor
                  <input
                    name="doctor"
                    value={form.doctor}
                    onChange={change}
                    required
                    placeholder="Doctor name"
                  />
                </label>

                <label>
                  Visit date
                  <input
                    name="visitDate"
                    type="date"
                    value={form.visitDate}
                    onChange={change}
                  />
                </label>

                <label className="full">
                  Visit status
                  <select
                    name="status"
                    value={form.status}
                    onChange={change}
                  >
                    <option>Scheduled</option>
                    <option>Checked In</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  className="primary-btn"
                  disabled={busy}
                >
                  {busy
                    ? 'Saving...'
                    : (
                      <>
                        {editingId ? 'Save changes' : 'Add patient'}
                        <CheckCircle2 size={17} />
                      </>
                    )}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
