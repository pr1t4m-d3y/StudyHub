function App() {
  const API_BASE = 'http://localhost:8080/api';

  // --- 1. GLOBAL UI STATES ---
  const [activeTab, setActiveTab] = React.useState('Dashboard');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [toast, setToast] = React.useState(null);
  const [activeModal, setActiveModal] = React.useState(null); // { type, data }
  const [selectedDay, setSelectedDay] = React.useState('All');
  const [assignmentFilter, setAssignmentFilter] = React.useState('all');

  // --- 2. BACKEND DATA STATES ---
  const [assignments, setAssignments] = React.useState([]);
  const [subjects, setSubjects] = React.useState([]);
  const [timetable, setTimetable] = React.useState([]);
  const [marks, setMarks] = React.useState([]);
  const [marksSummary, setMarksSummary] = React.useState({ sgpa: 9.33, cgpa: 9.33, totalCredits: 22 });
  const [attendance, setAttendance] = React.useState([]);
  const [attendanceSummary, setAttendanceSummary] = React.useState({ overallPercentage: 88, status: 'Safe' });
  const [tasks, setTasks] = React.useState([]);
  const [notes, setNotes] = React.useState([]);
  const [profile, setProfile] = React.useState({
    fullName: 'Pritam Dey',
    email: 'pritam@srmist.edu.in',
    registrationNumber: 'RA241100301276',
    program: 'B.Tech Computer Science & Engineering',
    semester: '5th Semester',
    institution: 'SRM Institute of Science and Technology',
    avatarInitials: 'PD'
  });

  // --- 3. POMODORO STATE ---
  const [pomoMode, setPomoMode] = React.useState('focus'); // focus, shortBreak, longBreak
  const [timeLeft, setTimeLeft] = React.useState(25 * 60);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [focusSubject, setFocusSubject] = React.useState('Operating Systems');
  const [sessionsCompleted, setSessionsCompleted] = React.useState(3);

  // --- 4. TOAST NOTIFICATION HELPER ---
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // --- 5. INITIAL DATA LOAD ---
  React.useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = () => {
    fetchAssignments();
    fetchSubjects();
    fetchTimetable();
    fetchMarks();
    fetchAttendance();
    fetchTasks();
    fetchNotes();
    fetchProfile();
  };

  const fetchAssignments = () => {
    fetch(`${API_BASE}/assignments`)
      .then(res => res.json())
      .then(data => Array.isArray(data) && setAssignments(data))
      .catch(err => console.error("Error fetching assignments:", err));
  };

  const fetchSubjects = () => {
    fetch(`${API_BASE}/subjects`)
      .then(res => res.json())
      .then(data => Array.isArray(data) && setSubjects(data))
      .catch(err => console.error("Error fetching subjects:", err));
  };

  const fetchTimetable = () => {
    fetch(`${API_BASE}/timetable`)
      .then(res => res.json())
      .then(data => Array.isArray(data) && setTimetable(data))
      .catch(err => console.error("Error fetching timetable:", err));
  };

  const fetchMarks = () => {
    fetch(`${API_BASE}/marks`)
      .then(res => res.json())
      .then(data => Array.isArray(data) && setMarks(data))
      .catch(err => console.error("Error fetching marks:", err));

    fetch(`${API_BASE}/marks/summary`)
      .then(res => res.json())
      .then(data => data && setMarksSummary(data))
      .catch(err => console.error("Error fetching marks summary:", err));
  };

  const fetchAttendance = () => {
    fetch(`${API_BASE}/attendance`)
      .then(res => res.json())
      .then(data => Array.isArray(data) && setAttendance(data))
      .catch(err => console.error("Error fetching attendance:", err));

    fetch(`${API_BASE}/attendance/summary`)
      .then(res => res.json())
      .then(data => data && setAttendanceSummary(data))
      .catch(err => console.error("Error fetching attendance summary:", err));
  };

  const fetchTasks = () => {
    fetch(`${API_BASE}/tasks`)
      .then(res => res.json())
      .then(data => Array.isArray(data) && setTasks(data))
      .catch(err => console.error("Error fetching tasks:", err));
  };

  const fetchNotes = () => {
    fetch(`${API_BASE}/notes`)
      .then(res => res.json())
      .then(data => Array.isArray(data) && setNotes(data))
      .catch(err => console.error("Error fetching notes:", err));
  };

  const fetchProfile = () => {
    fetch(`${API_BASE}/profile`)
      .then(res => res.json())
      .then(data => data && setProfile(data))
      .catch(err => console.error("Error fetching profile:", err));
  };

  // --- 6. POMODORO TIMER LOGIC ---
  React.useEffect(() => {
    let timer = null;
    if (timerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      setTimerRunning(false);
      showToast(`${pomoMode === 'focus' ? 'Focus Session Completed! Take a break.' : 'Break finished! Back to focus.'}`);
      if (pomoMode === 'focus') setSessionsCompleted(prev => prev + 1);
    }
    return () => clearInterval(timer);
  }, [timerRunning, timeLeft, pomoMode]);

  const switchPomoMode = (mode) => {
    setPomoMode(mode);
    setTimerRunning(false);
    if (mode === 'focus') setTimeLeft(25 * 60);
    else if (mode === 'shortBreak') setTimeLeft(5 * 60);
    else if (mode === 'longBreak') setTimeLeft(15 * 60);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- 7. BACKEND API MUTATION HANDLERS ---
  // Assignments
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAssign = {
      title: formData.get('title'),
      subject: formData.get('subject'),
      dueDate: formData.get('dueDate'),
      priority: formData.get('priority'),
      description: formData.get('description'),
      status: 'pending'
    };

    fetch(`${API_BASE}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAssign)
    })
      .then(res => res.json())
      .then(() => {
        fetchAssignments();
        setActiveModal(null);
        showToast('Assignment created successfully!');
      })
      .catch(() => showToast('Failed to create assignment', 'error'));
  };

  const toggleAssignmentStatus = (assign) => {
    const newStatus = assign.status === 'submitted' ? 'pending' : 'submitted';
    fetch(`${API_BASE}/assignments/${assign.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(res => res.json())
      .then(() => {
        fetchAssignments();
        showToast(`Assignment marked as ${newStatus}`);
      })
      .catch(() => showToast('Error updating assignment status', 'error'));
  };

  const deleteAssignment = (id) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    fetch(`${API_BASE}/assignments/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchAssignments();
        showToast('Assignment deleted');
      })
      .catch(() => showToast('Error deleting assignment', 'error'));
  };

  // Subjects
  const handleCreateSubject = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newSub = {
      name: fd.get('name'),
      code: fd.get('code'),
      credits: parseInt(fd.get('credits') || '3'),
      professorName: fd.get('professorName'),
      room: fd.get('room'),
      syllabus: fd.get('syllabus')
    };

    fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSub)
    })
      .then(res => res.json())
      .then(() => {
        fetchSubjects();
        setActiveModal(null);
        showToast('Subject added to database!');
      })
      .catch(() => showToast('Error adding subject', 'error'));
  };

  const deleteSubject = (id) => {
    if (!confirm('Delete this subject?')) return;
    fetch(`${API_BASE}/subjects/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchSubjects();
        showToast('Subject removed');
      })
      .catch(() => showToast('Error removing subject', 'error'));
  };

  // Timetable
  const handleCreateSlot = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newSlot = {
      dayOfWeek: fd.get('dayOfWeek'),
      startTime: fd.get('startTime'),
      endTime: fd.get('endTime'),
      subjectName: fd.get('subjectName'),
      room: fd.get('room'),
      type: fd.get('type'),
      instructor: fd.get('instructor')
    };

    fetch(`${API_BASE}/timetable`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSlot)
    })
      .then(res => res.json())
      .then(() => {
        fetchTimetable();
        setActiveModal(null);
        showToast('Timetable schedule updated!');
      })
      .catch(() => showToast('Error saving slot', 'error'));
  };

  const deleteSlot = (id) => {
    fetch(`${API_BASE}/timetable/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchTimetable();
        showToast('Schedule slot removed');
      })
      .catch(() => showToast('Error removing slot', 'error'));
  };

  // Marks / CGPA
  const handleCreateMark = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newMark = {
      semester: parseInt(fd.get('semester') || '5'),
      courseCode: fd.get('courseCode'),
      courseName: fd.get('courseName'),
      credits: parseInt(fd.get('credits') || '4'),
      internalMarks: parseInt(fd.get('internalMarks') || '0'),
      externalMarks: parseInt(fd.get('externalMarks') || '0')
    };

    fetch(`${API_BASE}/marks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMark)
    })
      .then(res => res.json())
      .then(() => {
        fetchMarks();
        setActiveModal(null);
        showToast('Course marks recorded and CGPA recalculated!');
      })
      .catch(() => showToast('Error recording marks', 'error'));
  };

  const deleteMark = (id) => {
    fetch(`${API_BASE}/marks/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchMarks();
        showToast('Record removed');
      })
      .catch(() => showToast('Error removing record', 'error'));
  };

  // Attendance
  const markAttendance = (id, present) => {
    fetch(`${API_BASE}/attendance/${id}/mark?present=${present}`, { method: 'PATCH' })
      .then(res => res.json())
      .then(() => {
        fetchAttendance();
        showToast(present ? 'Attendance marked: Present (+1)' : 'Attendance marked: Absent');
      })
      .catch(() => showToast('Error updating attendance', 'error'));
  };

  const handleCreateAttendance = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newAtt = {
      subjectName: fd.get('subjectName'),
      attendedClasses: parseInt(fd.get('attendedClasses') || '0'),
      totalClasses: parseInt(fd.get('totalClasses') || '0'),
      targetPercentage: 75
    };

    fetch(`${API_BASE}/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAtt)
    })
      .then(res => res.json())
      .then(() => {
        fetchAttendance();
        setActiveModal(null);
        showToast('Attendance tracked for new subject!');
      })
      .catch(() => showToast('Error creating attendance tracker', 'error'));
  };

  // Tasks (Quick Planner)
  const handleCreateTask = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newTask = {
      title: fd.get('title'),
      timeBlock: fd.get('timeBlock') || 'Today',
      priority: fd.get('priority') || 'medium',
      completed: false
    };

    fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    })
      .then(res => res.json())
      .then(() => {
        fetchTasks();
        setActiveModal(null);
        showToast('Task added to live database!');
      })
      .catch(() => showToast('Error creating task', 'error'));
  };

  const toggleTask = (id) => {
    fetch(`${API_BASE}/tasks/${id}/toggle`, { method: 'PATCH' })
      .then(res => res.json())
      .then(() => fetchTasks())
      .catch(() => showToast('Error updating task', 'error'));
  };

  const deleteTask = (id) => {
    fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchTasks();
        showToast('Task deleted');
      })
      .catch(() => showToast('Error deleting task', 'error'));
  };

  // Notes
  const handleCreateNote = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newNote = {
      title: fd.get('title'),
      subject: fd.get('subject'),
      content: fd.get('content'),
      icon: fd.get('icon') || 'fa-file-lines',
      dateFormatted: 'Just now'
    };

    fetch(`${API_BASE}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNote)
    })
      .then(res => res.json())
      .then(() => {
        fetchNotes();
        setActiveModal(null);
        showToast('Note saved to vault!');
      })
      .catch(() => showToast('Error saving note', 'error'));
  };

  const deleteNote = (id) => {
    fetch(`${API_BASE}/notes/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchNotes();
        showToast('Note deleted');
      })
      .catch(() => showToast('Error deleting note', 'error'));
  };

  // Profile
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const updated = {
      fullName: fd.get('fullName'),
      email: fd.get('email'),
      registrationNumber: fd.get('registrationNumber'),
      program: fd.get('program'),
      semester: fd.get('semester'),
      institution: fd.get('institution'),
      avatarInitials: (fd.get('fullName') || 'P D').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    };

    fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setActiveModal(null);
        showToast('Profile updated in database!');
      })
      .catch(() => showToast('Error updating profile', 'error'));
  };

  // Navigation Items
  const navItems = [
    { name: 'Dashboard', icon: 'fa-house' },
    { name: 'Subjects', icon: 'fa-book' },
    { name: 'Assignments', icon: 'fa-check-to-slot' },
    { name: 'Timetable', icon: 'fa-calendar-days' },
    { name: 'Marks/CGPA', icon: 'fa-chart-simple' },
    { name: 'Attendance', icon: 'fa-chart-line' },
    { name: 'Notes', icon: 'fa-pen-to-square' },
    { name: 'Study Planner', icon: 'fa-clock' },
    { name: 'Profile', icon: 'fa-user' }
  ];

  // Current day calculation
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];

  // Filter helpers
  const filterBySearch = (text) => {
    if (!searchTerm) return true;
    return (text || '').toLowerCase().includes(searchTerm.toLowerCase());
  };

  // --- 8. RENDER ACTIVE TAB ---
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard': {
        const pendingCount = assignments.filter(a => a.status === 'pending').length;
        const todaysClasses = timetable.filter(t => t.dayOfWeek.toLowerCase() === todayName.toLowerCase());

        return (
          <div className="dashboard-grid">
            {/* Welcome Card */}
            <section className="bento-card welcome-card">
              <div className="welcome-text">
                <h1>Welcome back, {profile.fullName.split(' ')[0]}!</h1>
                <p>{profile.program} • {profile.institution}</p>
                <p className="subtitle">
                  <i className="fa-solid fa-bell" style={{marginRight: '6px'}}></i>
                  You have {pendingCount} assignments due & {tasks.filter(t => !t.completed).length} pending tasks today.
                </p>
              </div>
              <button className="btn-primary" onClick={() => setActiveModal({ type: 'addAssignment' })}>
                + New Assignment
              </button>
            </section>

            {/* Live Stats */}
            <section className="bento-card stats-container">
              <div className="stat-box cgpa-box" onClick={() => setActiveTab('Marks/CGPA')} style={{cursor: 'pointer'}}>
                <i className="fa-solid fa-award stat-icon"></i>
                <div className="stat-details">
                  <h3>Calculated CGPA</h3>
                  <h2>{marksSummary.cgpa || '9.33'}</h2>
                  <span style={{fontSize: '0.75rem', color: 'var(--primary)'}}>Live from DBMS</span>
                </div>
              </div>
              <div className="stat-box attendance-box" onClick={() => setActiveTab('Attendance')} style={{cursor: 'pointer'}}>
                <i className="fa-solid fa-user-check stat-icon"></i>
                <div className="stat-details">
                  <h3>Overall Attendance</h3>
                  <h2>{attendanceSummary.overallPercentage || 88}%</h2>
                  <span style={{fontSize: '0.75rem', color: attendanceSummary.overallPercentage >= 75 ? '#16a34a' : '#dc2626'}}>
                    {attendanceSummary.status || 'Safe'} Zone
                  </span>
                </div>
              </div>
            </section>

            {/* Quick Planner Tasks */}
            <section className="bento-card planner-card">
              <div className="card-header">
                <h3><i className="fa-solid fa-list-check" style={{color: 'var(--primary)'}}></i> Quick Study Planner</h3>
                <button className="btn-primary" onClick={() => setActiveModal({ type: 'addTask' })} style={{padding: '6px 14px', fontSize:'0.85rem'}}>
                  + Add Task
                </button>
              </div>
              <ul className="task-list">
                {tasks.filter(t => filterBySearch(t.title)).map(task => (
                  <li key={task.id} className={`task-item priority-${task.priority}`}>
                    <div className="task-info" style={{ textDecoration: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.5 : 1 }}>
                      <strong>{task.title}</strong>
                      <span><i className="fa-regular fa-clock" style={{marginRight: '4px'}}></i>{task.timeBlock}</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <input
                        type="checkbox"
                        className="task-checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        title="Mark Done"
                      />
                      <button className="btn-icon" onClick={() => deleteTask(task.id)} title="Delete Task">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </li>
                ))}
                {tasks.length === 0 && <p style={{color: 'var(--text-muted)', textAlign: 'center', padding: '20px'}}>No tasks remaining! Add one above.</p>}
              </ul>
            </section>

            {/* Today's Schedule Card */}
            <section className="bento-card notes-card">
              <div className="card-header">
                <h3><i className="fa-solid fa-calendar-day" style={{color: 'var(--primary)'}}></i> Today's Classes ({todayName})</h3>
                <span className="view-all" onClick={() => setActiveTab('Timetable')} style={{cursor: 'pointer'}}>View Week</span>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {todaysClasses.length > 0 ? (
                  todaysClasses.map(slot => (
                    <div key={slot.id} style={{padding: '12px', background: '#f8fafc', borderRadius: '10px', borderLeft: '4px solid var(--primary)'}}>
                      <div style={{fontWeight: '700', fontSize: '0.95rem'}}>{slot.subjectName}</div>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px'}}>
                        <i className="fa-regular fa-clock" style={{marginRight: '4px'}}></i>{slot.startTime} - {slot.endTime} • {slot.room}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{padding: '20px', textAlign: 'center', color: 'var(--text-muted)'}}>
                    <i className="fa-solid fa-mug-hot" style={{fontSize: '2rem', marginBottom: '8px', color: 'var(--primary)'}}></i>
                    <p>No classes scheduled for today! Time for self-study.</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        );
      }

      case 'Subjects':
        return (
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <div>
                <h2>Registered Subjects</h2>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Current Semester 5 Curricula & Faculty Contact</p>
              </div>
              <button className="btn-primary" onClick={() => setActiveModal({ type: 'addSubject' })}>
                + Register New Subject
              </button>
            </div>

            <div className="dashboard-grid">
              {subjects
                .filter(s => filterBySearch(s.name) || filterBySearch(s.code) || filterBySearch(s.professorName))
                .map(sub => (
                  <section key={sub.id} className="bento-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <span className="badge" style={{background: '#eef2ff', color: 'var(--primary)'}}>{sub.code || 'CS300'}</span>
                      <button className="btn-icon" onClick={() => deleteSubject(sub.id)} title="Delete Subject">
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                    <h3 style={{fontSize: '1.15rem'}}>{sub.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                      <i className="fa-solid fa-user-tie" style={{marginRight: '6px', color: 'var(--primary)'}}></i>
                      {sub.professorName || 'TBA'}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      <i className="fa-solid fa-door-open" style={{marginRight: '6px'}}></i>
                      Room: {sub.room || 'Main Hall'} • Credits: {sub.credits}
                    </p>
                    <button
                      className="btn-secondary"
                      onClick={() => setActiveModal({ type: 'subjectDetails', data: sub })}
                      style={{ marginTop: 'auto', width: '100%' }}
                    >
                      <i className="fa-solid fa-file-lines" style={{marginRight: '6px'}}></i> Syllabus & Info
                    </button>
                  </section>
                ))}
              {subjects.length === 0 && (
                <div style={{gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                  No subjects registered. Click "+ Register New Subject" to add your courses!
                </div>
              )}
            </div>
          </div>
        );

      case 'Assignments': {
        const filteredAssignments = assignments
          .filter(a => {
            if (assignmentFilter === 'pending') return a.status === 'pending';
            if (assignmentFilter === 'submitted') return a.status === 'submitted';
            if (assignmentFilter === 'overdue') return a.status === 'OVERDUE';
            return true;
          })
          .filter(a => filterBySearch(a.title) || filterBySearch(a.subject));

        return (
          <section className="bento-card" style={{ width: '100%' }}>
            <div className="card-header" style={{flexWrap: 'wrap', gap: '12px'}}>
              <div>
                <h2>Assignments Tracker (Spring Boot & DBMS)</h2>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Manage coursework, submissions, and deadlines with real-time database sync</p>
              </div>
              <div style={{display: 'flex', gap: '10px'}}>
                <button className="btn-primary" onClick={() => setActiveModal({ type: 'addAssignment' })}>
                  + New Assignment
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="day-selector" style={{margin: '16px 0'}}>
              {['all', 'pending', 'submitted', 'overdue'].map(f => (
                <button
                  key={f}
                  className={`day-pill ${assignmentFilter === f ? 'active' : ''}`}
                  onClick={() => setAssignmentFilter(f)}
                >
                  {f.toUpperCase()} ({assignments.filter(a => f === 'all' ? true : a.status.toLowerCase() === f).length})
                </button>
              ))}
            </div>

            <ul className="task-list">
              {filteredAssignments.map(assign => (
                <li key={assign.id} className={`task-item priority-${assign.priority}`} style={{ opacity: assign.status === 'submitted' ? 0.7 : 1 }}>
                  <div className="task-info">
                    <strong style={{ textDecoration: assign.status === 'submitted' ? 'line-through' : 'none', color: assign.status === 'OVERDUE' ? 'var(--high-priority)' : 'inherit' }}>
                      {assign.title}
                    </strong>
                    <div style={{display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px'}}>
                      <span className="badge" style={{background: '#f1f5f9', color: '#475569'}}>{assign.subject}</span>
                      <span style={{ color: assign.status === 'submitted' ? '#16a34a' : (assign.status === 'OVERDUE' ? '#ef4444' : 'var(--text-muted)'), fontSize: '0.85rem' }}>
                        <i className="fa-regular fa-calendar-check" style={{marginRight: '4px'}}></i> Due: {assign.dueDate}
                      </span>
                      {assign.description && <span style={{fontSize: '0.8rem', color: '#64748b'}}>• {assign.description}</span>}
                    </div>
                  </div>

                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <span className={`badge badge-${assign.status.toLowerCase()}`}>
                      {assign.status}
                    </span>
                    <button
                      className={assign.status === 'submitted' ? "btn-secondary" : "btn-success"}
                      onClick={() => toggleAssignmentStatus(assign)}
                      style={{padding: '6px 14px', fontSize: '0.85rem'}}
                    >
                      {assign.status === 'submitted' ? 'Undo' : 'Mark Done'}
                    </button>
                    <button className="btn-icon" onClick={() => deleteAssignment(assign.id)} title="Delete Assignment">
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </li>
              ))}
              {filteredAssignments.length === 0 && (
                <p style={{color: 'var(--text-muted)', textAlign: 'center', padding: '30px'}}>
                  No assignments found matching the selected filter.
                </p>
              )}
            </ul>
          </section>
        );
      }

      case 'Timetable': {
        const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const filteredSlots = timetable
          .filter(t => selectedDay === 'All' || t.dayOfWeek.toLowerCase() === selectedDay.toLowerCase())
          .filter(t => filterBySearch(t.subjectName) || filterBySearch(t.room) || filterBySearch(t.instructor));

        return (
          <section className="bento-card" style={{ width: '100%' }}>
            <div className="card-header" style={{flexWrap: 'wrap', gap: '12px'}}>
              <div>
                <h2>Weekly Timetable & Schedule</h2>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Class timings, lecture halls, and lab locations</p>
              </div>
              <button className="btn-primary" onClick={() => setActiveModal({ type: 'addSlot' })}>
                + Add Class Slot
              </button>
            </div>

            {/* Day Selector */}
            <div className="day-selector">
              <button
                className={`day-pill ${selectedDay === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedDay('All')}
              >
                All Days
              </button>
              {weekDays.map(day => (
                <button
                  key={day}
                  className={`day-pill ${selectedDay === day ? 'active' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day} {todayName.toLowerCase() === day.toLowerCase() && '⭐ (Today)'}
                </button>
              ))}
            </div>

            {/* Timetable Grid */}
            <div className="timetable-grid">
              {filteredSlots.map(slot => (
                <div key={slot.id} className={`slot-card ${slot.type === 'Lab' ? 'lab' : ''}`}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span className="slot-time">
                      <i className="fa-regular fa-clock"></i> {slot.startTime} - {slot.endTime}
                    </span>
                    <span className="badge" style={{background: slot.type === 'Lab' ? '#cffafe' : '#f1f5f9', color: slot.type === 'Lab' ? '#0891b2' : '#475569'}}>
                      {slot.type}
                    </span>
                  </div>

                  <div className="slot-title">{slot.subjectName}</div>

                  <div className="slot-meta">
                    <span><i className="fa-solid fa-location-dot" style={{marginRight: '4px'}}></i> {slot.room}</span>
                    <span><i className="fa-solid fa-calendar" style={{marginRight: '4px'}}></i> {slot.dayOfWeek}</span>
                  </div>

                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', paddingTop: '8px', borderTop: '1px solid var(--border-color)'}}>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>
                      <i className="fa-solid fa-chalkboard-user" style={{marginRight: '4px'}}></i> {slot.instructor}
                    </span>
                    <button className="btn-icon" onClick={() => deleteSlot(slot.id)} title="Delete Slot">
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))}
              {filteredSlots.length === 0 && (
                <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                  No classes scheduled for {selectedDay}. Add one above!
                </div>
              )}
            </div>
          </section>
        );
      }

      case 'Marks/CGPA': {
        const filteredMarks = marks.filter(m => filterBySearch(m.courseName) || filterBySearch(m.courseCode));

        return (
          <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            {/* Top Metrics Bento */}
            <div className="dashboard-grid">
              <section className="bento-card" style={{gridColumn: 'span 1', background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', color: 'white'}}>
                <span style={{fontSize: '0.85rem', opacity: 0.9}}>Cumulative GPA</span>
                <h1 style={{fontSize: '3rem', margin: '8px 0'}}>{marksSummary.cgpa || '9.33'}</h1>
                <p style={{fontSize: '0.85rem', opacity: 0.85}}>Based on {marksSummary.totalCourses || marks.length} credited courses</p>
              </section>

              <section className="bento-card" style={{gridColumn: 'span 1'}}>
                <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Semester 5 SGPA</span>
                <h1 style={{fontSize: '3rem', margin: '8px 0', color: 'var(--primary)'}}>{marksSummary.sgpa || '9.40'}</h1>
                <p style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Total Credits Registered: {marksSummary.totalCredits || 22}</p>
              </section>

              <section className="bento-card" style={{gridColumn: 'span 1', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <h3>Grade Calculation Engine</h3>
                <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', margin: '8px 0'}}>
                  Grades & SGPA are automatically calculated via Java Spring Boot backend business rules.
                </p>
                <button className="btn-primary" onClick={() => setActiveModal({ type: 'addMark' })}>
                  + Add Course Marks
                </button>
              </section>
            </div>

            {/* Detailed Marks Breakdown Table */}
            <section className="bento-card" style={{width: '100%'}}>
              <div className="card-header">
                <h3><i className="fa-solid fa-graduation-cap" style={{color: 'var(--primary)'}}></i> Academic Performance & Grade Ledger</h3>
              </div>

              <div className="marks-table-wrap">
                <table className="styled-table">
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Course Name</th>
                      <th>Credits</th>
                      <th>Internal (/50)</th>
                      <th>External (/50)</th>
                      <th>Total (/100)</th>
                      <th>Grade</th>
                      <th>Grade Points</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMarks.map(item => (
                      <tr key={item.id}>
                        <td style={{fontWeight: '700'}}>{item.courseCode}</td>
                        <td>{item.courseName}</td>
                        <td>{item.credits}</td>
                        <td>{item.internalMarks}</td>
                        <td>{item.externalMarks}</td>
                        <td style={{fontWeight: '700'}}>{item.totalMarks}</td>
                        <td>
                          <span className="badge" style={{
                            background: item.grade === 'O' ? '#dcfce7' : (item.grade === 'A+' ? '#dbeafe' : '#fef3c7'),
                            color: item.grade === 'O' ? '#15803d' : (item.grade === 'A+' ? '#1d4ed8' : '#b45309')
                          }}>
                            {item.grade}
                          </span>
                        </td>
                        <td style={{fontWeight: '700', color: 'var(--primary)'}}>{item.gradePoints}</td>
                        <td>
                          <button className="btn-icon" onClick={() => deleteMark(item.id)} title="Delete Record">
                            <i className="fa-solid fa-trash-can"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredMarks.length === 0 && (
                      <tr>
                        <td colSpan="9" style={{textAlign: 'center', padding: '30px', color: 'var(--text-muted)'}}>
                          No marks records found. Add courses above!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        );
      }

      case 'Attendance': {
        const filteredAtt = attendance.filter(a => filterBySearch(a.subjectName));

        return (
          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'}}>
              <div>
                <h2>Smart Attendance Tracker & Bunk Advisor</h2>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Maintain mandatory 75% attendance with live projection and single-click logging</p>
              </div>
              <button className="btn-primary" onClick={() => setActiveModal({ type: 'addAttendance' })}>
                + Track New Subject
              </button>
            </div>

            <div className="attendance-grid">
              {filteredAtt.map(item => {
                // Calculate bunk potential or classes needed
                const { attendedClasses: a, totalClasses: t, percentage: p } = item;
                let adviceText = '';
                if (p >= 75) {
                  // Safe: can miss x classes: a / (t + x) >= 0.75 => x <= (a / 0.75) - t
                  const canMiss = Math.floor((a / 0.75) - t);
                  adviceText = canMiss > 0
                    ? `Safe! You can miss ${canMiss} more lecture${canMiss > 1 ? 's' : ''} safely.`
                    : `On the edge! Do not miss the next class.`;
                } else {
                  // Shortage: need to attend y classes: (a + y) / (t + y) >= 0.75 => 0.25y >= 0.75t - a => y >= 3t - 4a
                  const mustAttend = Math.ceil(3 * t - 4 * a);
                  adviceText = `Shortage! Attend the next ${mustAttend} consecutive class${mustAttend > 1 ? 'es' : ''} to reach 75%.`;
                }

                return (
                  <section key={item.id} className="att-card">
                    <div className="att-header">
                      <div>
                        <h3 style={{fontSize: '1.1rem'}}>{item.subjectName}</h3>
                        <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>
                          {item.attendedClasses} attended / {item.totalClasses} held
                        </span>
                      </div>
                      <span className={`badge badge-${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </div>

                    <h1 style={{
                      color: item.percentage < 75 ? 'var(--high-priority)' : 'var(--primary)',
                      margin: '6px 0',
                      fontSize: '2.5rem'
                    }}>
                      {item.percentage}%
                    </h1>

                    <div className="att-progress-bar">
                      <div
                        className="att-progress-fill"
                        style={{
                          width: `${Math.min(item.percentage, 100)}%`,
                          backgroundColor: item.percentage < 75 ? 'var(--high-priority)' : (item.percentage < 80 ? 'var(--med-priority)' : 'var(--primary)')
                        }}
                      ></div>
                    </div>

                    <div className="att-advice">
                      <i className="fa-solid fa-lightbulb" style={{color: item.percentage < 75 ? 'var(--high-priority)' : 'var(--primary)', marginRight: '6px'}}></i>
                      {adviceText}
                    </div>

                    <div className="att-actions">
                      <button className="btn-success" onClick={() => markAttendance(item.id, true)}>
                        <i className="fa-solid fa-check" style={{marginRight: '4px'}}></i> + Present
                      </button>
                      <button className="btn-danger" onClick={() => markAttendance(item.id, false)}>
                        <i className="fa-solid fa-xmark" style={{marginRight: '4px'}}></i> - Absent
                      </button>
                    </div>
                  </section>
                );
              })}
              {filteredAtt.length === 0 && (
                <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                  No attendance records found. Click "+ Track New Subject" to begin tracking.
                </div>
              )}
            </div>
          </div>
        );
      }

      case 'Notes': {
        const filteredNotes = notes.filter(n => filterBySearch(n.title) || filterBySearch(n.subject) || filterBySearch(n.content));

        return (
          <section className="bento-card" style={{ width: '100%' }}>
            <div className="card-header" style={{flexWrap: 'wrap', gap: '12px'}}>
              <div>
                <h2>Engineering Notes Vault</h2>
                <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Quick revision snippets, exam formulas, and architectural references</p>
              </div>
              <button className="btn-primary" onClick={() => setActiveModal({ type: 'addNote' })}>
                + New Note
              </button>
            </div>

            <div className="dashboard-grid">
              {filteredNotes.map(note => (
                <div key={note.id} className="note-item" style={{ gridColumn: 'span 1' }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <i className={`fa-solid ${note.icon || 'fa-file-lines'} note-icon`}></i>
                    <button className="btn-icon" onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }} title="Delete Note">
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                  <h4>{note.title}</h4>
                  <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{note.subject}</span>
                  <p style={{fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.4', maxHeight: '70px', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {note.content}
                  </p>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '8px'}}>
                    <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{note.dateFormatted}</span>
                    <button
                      className="btn-secondary"
                      style={{padding: '4px 8px', fontSize: '0.75rem'}}
                      onClick={() => setActiveModal({ type: 'viewNote', data: note })}
                    >
                      Read Full
                    </button>
                  </div>
                </div>
              ))}
              {filteredNotes.length === 0 && (
                <div style={{gridColumn: 'span 3', textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>
                  No notes found. Create your first note above!
                </div>
              )}
            </div>
          </section>
        );
      }

      case 'Study Planner':
        return (
          <div className="dashboard-grid">
            <section className="bento-card" style={{ gridColumn: 'span 2' }}>
              <div className="pomodoro-container">
                <div className="pomodoro-modes">
                  <button
                    className={`pomodoro-mode-btn ${pomoMode === 'focus' ? 'active' : ''}`}
                    onClick={() => switchPomoMode('focus')}
                  >
                    Focus (25m)
                  </button>
                  <button
                    className={`pomodoro-mode-btn ${pomoMode === 'shortBreak' ? 'active' : ''}`}
                    onClick={() => switchPomoMode('shortBreak')}
                  >
                    Short Break (5m)
                  </button>
                  <button
                    className={`pomodoro-mode-btn ${pomoMode === 'longBreak' ? 'active' : ''}`}
                    onClick={() => switchPomoMode('longBreak')}
                  >
                    Long Break (15m)
                  </button>
                </div>

                <div className="timer-display">
                  {formatTimer(timeLeft)}
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem'}}>
                  <span>Focusing on:</span>
                  <select
                    className="form-select"
                    style={{padding: '6px 12px', fontSize: '0.9rem'}}
                    value={focusSubject}
                    onChange={(e) => setFocusSubject(e.target.value)}
                  >
                    {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    {subjects.length === 0 && <option value="Operating Systems">Operating Systems</option>}
                  </select>
                </div>

                <div className="timer-controls">
                  <button
                    className="btn-primary"
                    style={{padding: '12px 36px', fontSize: '1.1rem'}}
                    onClick={() => setTimerRunning(!timerRunning)}
                  >
                    <i className={`fa-solid ${timerRunning ? 'fa-pause' : 'fa-play'}`} style={{marginRight: '8px'}}></i>
                    {timerRunning ? 'Pause' : 'Start Focus'}
                  </button>
                  <button
                    className="btn-secondary"
                    style={{padding: '12px 24px'}}
                    onClick={() => switchPomoMode(pomoMode)}
                  >
                    <i className="fa-solid fa-rotate-left"></i> Reset
                  </button>
                </div>
              </div>
            </section>

            <section className="bento-card" style={{ gridColumn: 'span 1', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3><i className="fa-solid fa-fire" style={{color: '#f97316'}}></i> Productivity Metrics</h3>
              <div style={{background: '#f8fafc', padding: '16px', borderRadius: '12px'}}>
                <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Sessions Completed</span>
                <h2 style={{color: 'var(--primary)', marginTop: '4px'}}>{sessionsCompleted} Pomodoros</h2>
              </div>
              <div style={{background: '#f8fafc', padding: '16px', borderRadius: '12px'}}>
                <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Total Focus Time</span>
                <h2 style={{color: '#16a34a', marginTop: '4px'}}>{(sessionsCompleted * 25) / 60} hrs</h2>
              </div>
              <div style={{background: '#f8fafc', padding: '16px', borderRadius: '12px'}}>
                <span style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>Active Subjects</span>
                <h2 style={{marginTop: '4px'}}>{subjects.length} Courses</h2>
              </div>
            </section>
          </div>
        );

      case 'Profile':
        return (
          <section className="bento-card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <div className="avatar" style={{ width: '90px', height: '90px', fontSize: '2.2rem', margin: '0 auto 16px auto', boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)' }}>
              {profile.avatarInitials || 'PD'}
            </div>
            <h2 style={{ marginBottom: '4px' }}>{profile.fullName}</h2>
            <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{profile.program}</p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{profile.institution}</p>

            <div style={{ textAlign: 'left', background: '#f8fafc', padding: '24px', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><strong>Email Address:</strong> <span style={{color: '#475569'}}>{profile.email}</span></div>
              <div><strong>Registration No:</strong> <span style={{color: '#475569'}}>{profile.registrationNumber}</span></div>
              <div><strong>Current Semester:</strong> <span style={{color: '#475569'}}>{profile.semester}</span></div>
              <div><strong>Institution:</strong> <span style={{color: '#475569'}}>{profile.institution}</span></div>
            </div>

            <button
              className="btn-primary"
              onClick={() => setActiveModal({ type: 'editProfile' })}
              style={{ marginTop: '24px', width: '100%' }}
            >
              <i className="fa-solid fa-pen-to-square" style={{marginRight: '8px'}}></i> Edit Profile Information
            </button>
          </section>
        );

      default:
        return null;
    }
  };

  // --- 9. MODALS RENDERER ---
  const renderModal = () => {
    if (!activeModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setActiveModal(null)}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          {/* Add Assignment Modal */}
          {activeModal.type === 'addAssignment' && (
            <form onSubmit={handleCreateAssignment}>
              <div className="modal-header">
                <h3><i className="fa-solid fa-check-to-slot" style={{color: 'var(--primary)'}}></i> Add New Assignment</h3>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
              </div>
              <div className="form-group">
                <label>Assignment Title *</label>
                <input name="title" className="form-input" required placeholder="e.g. Page Replacement Simulation" />
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <select name="subject" className="form-select" required>
                  {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  {subjects.length === 0 && <option value="Operating Systems">Operating Systems</option>}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date *</label>
                <input name="dueDate" type="date" className="form-input" required defaultValue="2026-11-15" />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select name="priority" className="form-select" defaultValue="medium">
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description / Instructions</label>
                <textarea name="description" className="form-textarea" placeholder="Enter problem statement or submission guidelines..."></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save to Database</button>
              </div>
            </form>
          )}

          {/* Add Subject Modal */}
          {activeModal.type === 'addSubject' && (
            <form onSubmit={handleCreateSubject}>
              <div className="modal-header">
                <h3><i className="fa-solid fa-book" style={{color: 'var(--primary)'}}></i> Register New Subject</h3>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
              </div>
              <div className="form-group">
                <label>Subject Name *</label>
                <input name="name" className="form-input" required placeholder="e.g. Artificial Intelligence" />
              </div>
              <div className="form-group">
                <label>Course Code *</label>
                <input name="code" className="form-input" required placeholder="e.g. CS306" />
              </div>
              <div className="form-group">
                <label>Credits</label>
                <input name="credits" type="number" min="1" max="6" className="form-input" defaultValue="4" />
              </div>
              <div className="form-group">
                <label>Professor / Instructor Name</label>
                <input name="professorName" className="form-input" placeholder="e.g. Dr. Rajesh Kumar" />
              </div>
              <div className="form-group">
                <label>Classroom / Lab Location</label>
                <input name="room" className="form-input" placeholder="e.g. Tech Park 401" />
              </div>
              <div className="form-group">
                <label>Syllabus Outline</label>
                <textarea name="syllabus" className="form-textarea" placeholder="Key topics and modules..."></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Subject</button>
              </div>
            </form>
          )}

          {/* View Subject Details Modal */}
          {activeModal.type === 'subjectDetails' && (
            <div>
              <div className="modal-header">
                <h3><i className="fa-solid fa-book-open" style={{color: 'var(--primary)'}}></i> {activeModal.data.name}</h3>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                <div><strong>Course Code:</strong> {activeModal.data.code}</div>
                <div><strong>Credits:</strong> {activeModal.data.credits} Credits</div>
                <div><strong>Instructor:</strong> {activeModal.data.professorName || 'Not specified'}</div>
                <div><strong>Room / Hall:</strong> {activeModal.data.room || 'General Classroom'}</div>
                <div>
                  <strong>Syllabus & Modules:</strong>
                  <div style={{background: '#f8fafc', padding: '12px', borderRadius: '8px', marginTop: '6px', fontSize: '0.9rem', lineHeight: '1.5'}}>
                    {activeModal.data.syllabus || 'Detailed curriculum uploaded to SRM student portal.'}
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-primary" onClick={() => setActiveModal(null)}>Close</button>
              </div>
            </div>
          )}

          {/* Add Timetable Slot Modal */}
          {activeModal.type === 'addSlot' && (
            <form onSubmit={handleCreateSlot}>
              <div className="modal-header">
                <h3><i className="fa-solid fa-calendar-plus" style={{color: 'var(--primary)'}}></i> Schedule Timetable Slot</h3>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
              </div>
              <div className="form-group">
                <label>Day of Week *</label>
                <select name="dayOfWeek" className="form-select" defaultValue="Monday">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div style={{display: 'flex', gap: '12px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Start Time *</label>
                  <input name="startTime" className="form-input" required placeholder="09:00 AM" defaultValue="09:00 AM" />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>End Time *</label>
                  <input name="endTime" className="form-input" required placeholder="10:00 AM" defaultValue="10:00 AM" />
                </div>
              </div>
              <div className="form-group">
                <label>Subject Name *</label>
                <select name="subjectName" className="form-select">
                  {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  {subjects.length === 0 && <option value="Operating Systems">Operating Systems</option>}
                </select>
              </div>
              <div className="form-group">
                <label>Type</label>
                <select name="type" className="form-select" defaultValue="Lecture">
                  <option value="Lecture">Lecture</option>
                  <option value="Lab">Practical Lab</option>
                  <option value="Tutorial">Tutorial / Seminar</option>
                </select>
              </div>
              <div className="form-group">
                <label>Room / Lab Hall</label>
                <input name="room" className="form-input" placeholder="e.g. TP 402 or Software Lab 3" defaultValue="TP 402" />
              </div>
              <div className="form-group">
                <label>Instructor</label>
                <input name="instructor" className="form-input" placeholder="e.g. Dr. K. Sharma" />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Slot</button>
              </div>
            </form>
          )}

          {/* Add Mark Modal */}
          {activeModal.type === 'addMark' && (
            <form onSubmit={handleCreateMark}>
              <div className="modal-header">
                <h3><i className="fa-solid fa-chart-simple" style={{color: 'var(--primary)'}}></i> Add Course Performance</h3>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
              </div>
              <div className="form-group">
                <label>Course Code *</label>
                <input name="courseCode" className="form-input" required placeholder="e.g. CS305" />
              </div>
              <div className="form-group">
                <label>Course Name *</label>
                <input name="courseName" className="form-input" required placeholder="e.g. Software Engineering" />
              </div>
              <div className="form-group">
                <label>Credits *</label>
                <input name="credits" type="number" min="1" max="6" defaultValue="4" className="form-input" required />
              </div>
              <div style={{display: 'flex', gap: '12px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Internal Marks (/50) *</label>
                  <input name="internalMarks" type="number" min="0" max="50" defaultValue="45" className="form-input" required />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>External Marks (/50) *</label>
                  <input name="externalMarks" type="number" min="0" max="50" defaultValue="45" className="form-input" required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Calculate & Save</button>
              </div>
            </form>
          )}

          {/* Add Attendance Tracker Modal */}
          {activeModal.type === 'addAttendance' && (
            <form onSubmit={handleCreateAttendance}>
              <div className="modal-header">
                <h3><i className="fa-solid fa-user-check" style={{color: 'var(--primary)'}}></i> Track Subject Attendance</h3>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
              </div>
              <div className="form-group">
                <label>Subject Name *</label>
                <input name="subjectName" className="form-input" required placeholder="e.g. Computer Networks" />
              </div>
              <div style={{display: 'flex', gap: '12px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Attended Classes *</label>
                  <input name="attendedClasses" type="number" min="0" defaultValue="25" className="form-input" required />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Total Classes Held *</label>
                  <input name="totalClasses" type="number" min="1" defaultValue="30" className="form-input" required />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Start Tracking</button>
              </div>
            </form>
          )}

          {/* Add Quick Task Modal */}
          {activeModal.type === 'addTask' && (
            <form onSubmit={handleCreateTask}>
              <div className="modal-header">
                <h3><i className="fa-solid fa-clock" style={{color: 'var(--primary)'}}></i> Add Study Task</h3>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
              </div>
              <div className="form-group">
                <label>Task Title *</label>
                <input name="title" className="form-input" required placeholder="e.g. Implement Dijkstra Algorithm" />
              </div>
              <div className="form-group">
                <label>Time Block / Deadline</label>
                <input name="timeBlock" className="form-input" placeholder="e.g. 2 Hours Block or Tonight 9PM" defaultValue="1 Hour Block" />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select name="priority" className="form-select" defaultValue="medium">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Add Task</button>
              </div>
            </form>
          )}

          {/* Add Note Modal */}
          {activeModal.type === 'addNote' && (
            <form onSubmit={handleCreateNote}>
              <div className="modal-header">
                <h3><i className="fa-solid fa-pen-to-square" style={{color: 'var(--primary)'}}></i> New Vault Note</h3>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
              </div>
              <div className="form-group">
                <label>Note Title *</label>
                <input name="title" className="form-input" required placeholder="e.g. B-Tree vs B+ Tree in DBMS" />
              </div>
              <div className="form-group">
                <label>Subject *</label>
                <input name="subject" className="form-input" required placeholder="e.g. DBMS" defaultValue="DBMS" />
              </div>
              <div className="form-group">
                <label>Icon</label>
                <select name="icon" className="form-select" defaultValue="fa-database">
                  <option value="fa-database">Database</option>
                  <option value="fa-microchip">Operating Systems / Hardware</option>
                  <option value="fa-network-wired">Networking</option>
                  <option value="fa-code">Programming / DSA</option>
                  <option value="fa-leaf">Spring Boot / Java</option>
                  <option value="fa-file-lines">General Document</option>
                </select>
              </div>
              <div className="form-group">
                <label>Note Content *</label>
                <textarea name="content" className="form-textarea" style={{minHeight: '120px'}} required placeholder="Key concepts, definitions, formulas..."></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save to Vault</button>
              </div>
            </form>
          )}

          {/* View Full Note Modal */}
          {activeModal.type === 'viewNote' && (
            <div>
              <div className="modal-header">
                <h3><i className={`fa-solid ${activeModal.data.icon || 'fa-file-lines'}`} style={{color: 'var(--primary)'}}></i> {activeModal.data.title}</h3>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
              </div>
              <div style={{color: 'var(--primary)', fontWeight: '600', marginBottom: '12px'}}>{activeModal.data.subject} • {activeModal.data.dateFormatted}</div>
              <div style={{background: '#f8fafc', padding: '16px', borderRadius: '10px', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap'}}>
                {activeModal.data.content}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-primary" onClick={() => setActiveModal(null)}>Close</button>
              </div>
            </div>
          )}

          {/* Edit Profile Modal */}
          {activeModal.type === 'editProfile' && (
            <form onSubmit={handleUpdateProfile}>
              <div className="modal-header">
                <h3><i className="fa-solid fa-user-pen" style={{color: 'var(--primary)'}}></i> Edit Student Profile</h3>
                <button type="button" className="modal-close" onClick={() => setActiveModal(null)}>&times;</button>
              </div>
              <div className="form-group">
                <label>Full Name *</label>
                <input name="fullName" className="form-input" required defaultValue={profile.fullName} />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input name="email" type="email" className="form-input" required defaultValue={profile.email} />
              </div>
              <div className="form-group">
                <label>Registration Number</label>
                <input name="registrationNumber" className="form-input" defaultValue={profile.registrationNumber} />
              </div>
              <div className="form-group">
                <label>Program / Major</label>
                <input name="program" className="form-input" defaultValue={profile.program} />
              </div>
              <div className="form-group">
                <label>Semester</label>
                <input name="semester" className="form-input" defaultValue={profile.semester} />
              </div>
              <div className="form-group">
                <label>Institution / University</label>
                <input name="institution" className="form-input" defaultValue={profile.institution} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Update Profile</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <i className="fa-solid fa-graduation-cap"></i>
          <h2>StudyHub</h2>
        </div>
        <nav className="nav-menu">
          {navItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className={`nav-item ${activeTab === item.name ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(item.name);
              }}
            >
              <i className={`fa-solid ${item.icon}`}></i>
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="top-header">
          <div className="search-bar">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder={`Search in ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="user-profile">
            <button className="notification-btn" title="Live DB Connected">
              <i className="fa-solid fa-database" style={{color: '#16a34a'}}></i>
            </button>
            <div className="avatar-info" onClick={() => setActiveTab('Profile')}>
              <div className="avatar">{profile.avatarInitials || 'PD'}</div>
              <span className="user-name">{profile.fullName}</span>
            </div>
          </div>
        </header>

        {renderTabContent()}
      </main>

      {/* Render Dynamic Modal */}
      {renderModal()}

      {/* Floating Toast Alert */}
      {toast && (
        <div className="toast-container">
          <div className={`toast-msg ${toast.type === 'error' ? 'toast-error' : 'toast-success'}`}>
            <i className={`fa-solid ${toast.type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);