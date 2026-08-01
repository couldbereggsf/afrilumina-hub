// ====================================
//   ADMIN PORTAL LOGIC
// ====================================

// Define Default Seed Data
const defaultRegistrations = [
    {
        id: "reg_1719942000000",
        name: "Amina Yusuf",
        email: "amina.yusuf@gmail.com",
        phone: "+254 712 345678",
        role: "student",
        date: "2026-07-01",
        status: "approved",
        details: {
            program: "Lumina Mentorship Hub",
            status: "Recent Graduate",
            linkedin: "https://linkedin.com/in/aminayusuf",
            motivation: "I want to transition into UX design. As a recent graduate in computer science, I lack practical portfolio guidance. Having a mentor from a global tech company would help me polish my design processes and prepare for career opportunities."
        }
    },
    {
        id: "reg_1720028400000",
        name: "Dr. Chioma Adebayo",
        email: "chioma.adebayo@unilag.edu.ng",
        phone: "+234 803 123 4567",
        role: "mentor",
        date: "2026-07-02",
        status: "approved",
        details: {
            organization: "University of Lagos",
            website: "https://unilag.edu.ng",
            message: "I am passionate about empowering African young minds in science and tech. I would love to support AfriLumina by mentoring computer science majors, conducting academic workshops, and providing career navigation advisory."
        }
    },
    {
        id: "reg_1720114800000",
        name: "David Mensah",
        email: "d.mensah@outlook.com",
        phone: "+233 24 123 4567",
        role: "volunteer",
        date: "2026-07-03",
        status: "pending",
        details: {
            organization: "",
            website: "https://linkedin.com/in/davidmensah",
            message: "I have 3 years of experience in social media management and community building. I want to volunteer my skills to handle AfriLumina's online presence, write newsletters, and coordinate communication for upcoming events."
        }
    },
    {
        id: "reg_1720201200000",
        name: "Farah Ibrahim",
        email: "farah.ibrahim@strathmore.edu",
        phone: "+254 722 000111",
        role: "student",
        date: "2026-07-04",
        status: "pending",
        details: {
            program: "Skills Accelerator",
            status: "Student",
            linkedin: "",
            motivation: "I want to master web development and software engineering. Strathmore teaches theory, but AfriLumina offers the hands-on project experience that employers actually value. I am eager to learn Git, Node.js, and React."
        }
    },
    {
        id: "reg_1720287600000",
        name: "John Doe / Acme Corp",
        email: "partnerships@acme.com",
        phone: "+1 555 019 2834",
        role: "partner",
        date: "2026-07-05",
        status: "pending",
        details: {
            organization: "Acme Corporation",
            website: "https://acme.com",
            message: "Acme Corp is looking to sponsor African technology cohorts. We are willing to fund the Lumina Mentorship Hub with a Bronze/Silver level tier next year, providing both financial support and direct internship pipelines."
        }
    },
    {
        id: "reg_1720374000000",
        name: "Lindiwe Dlamini",
        email: "lindiwe.d@gmail.com",
        phone: "+27 82 999 8888",
        role: "volunteer",
        date: "2026-07-06",
        status: "approved",
        details: {
            organization: "TechGirls SA",
            website: "",
            message: "I want to help with event coordination and speaker recruitment. I have experience hosting tech conferences in South Africa and can coordinate local logistics and help line up prominent industry speakers."
        }
    },
    {
        id: "reg_1720460400000",
        name: "Tariq Al-Mansoor",
        email: "tariq.mansoor@techcorp.com",
        phone: "+971 50 123 4567",
        role: "mentor",
        date: "2026-07-07",
        status: "rejected",
        details: {
            organization: "TechCorp Global",
            website: "https://techcorp.com",
            message: "Sales consultant with 20 years experience. I want to mentor students. (Declined because expertise does not match current programs curriculum: requires tech/STEM engineering alignment)."
        }
    },
    {
        id: "reg_1720460450000",
        name: "Mercy Awuor",
        email: "mercy.awuor@gmail.com",
        phone: "+254 701 987654",
        role: "student",
        date: "2026-07-07",
        status: "pending",
        details: {
            program: "Global & Local Career Exposure",
            status: "Unemployed / Career Changer",
            linkedin: "https://linkedin.com/in/mercyawuor",
            motivation: "I have been trying to break into data analysis for the last year. I finished Google Data Analytics Certificate, but I need real projects and connections with companies. AfriLumina career program is my best opportunity to show my capability."
        }
    }
];

// Initialize State
let registrations = [];
let selectedRegId = null;

// ====================================
//   DATABASE UTILITIES
// ====================================

function loadDatabase() {
    try {
        const rawData = localStorage.getItem('afrilumina_registrations');
        if (!rawData) {
            // First time loading - seed with default mock data
            localStorage.setItem('afrilumina_registrations', JSON.stringify(defaultRegistrations));
            registrations = [...defaultRegistrations];
        } else {
            registrations = JSON.parse(rawData);
            // If the data is corrupted, not an array, or empty, re-seed with default mock data
            if (!Array.isArray(registrations) || registrations.length === 0) {
                localStorage.setItem('afrilumina_registrations', JSON.stringify(defaultRegistrations));
                registrations = [...defaultRegistrations];
            }
        }
    } catch (e) {
        console.error("Error loading registrations from localStorage:", e);
        localStorage.setItem('afrilumina_registrations', JSON.stringify(defaultRegistrations));
        registrations = [...defaultRegistrations];
    }
}

function saveDatabase() {
    localStorage.setItem('afrilumina_registrations', JSON.stringify(registrations));
}

function getStats() {
    const stats = {
        total: registrations.length,
        students: 0,
        mentors: 0,
        volunteers: 0,
        pending: 0
    };

    registrations.forEach(reg => {
        if (reg.role === 'student') stats.students++;
        else if (reg.role === 'mentor') stats.mentors++;
        else if (reg.role === 'volunteer') stats.volunteers++;
        
        if (reg.status === 'pending') stats.pending++;
    });

    return stats;
}

// ====================================
//   UI RENDERING
// ====================================

function updateStatsUI() {
    const stats = getStats();
    
    // Animate stats numbers if counters are initialized
    animateCounter('count-students', stats.students);
    animateCounter('count-mentors', stats.mentors);
    animateCounter('count-volunteers', stats.volunteers);
    animateCounter('count-pending', stats.pending);
}

function animateCounter(id, targetValue) {
    const el = document.getElementById(id);
    if (!el) return;
    
    const startValue = parseInt(el.textContent) || 0;
    if (startValue === targetValue) {
        el.textContent = targetValue;
        return;
    }
    
    const duration = 800; // ms
    const startTime = performance.now();
    
    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function outQuad
        const ease = progress * (2 - progress);
        const currentValue = Math.floor(startValue + ease * (targetValue - startValue));
        
        el.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = targetValue;
        }
    }
    
    requestAnimationFrame(update);
}

function renderTable() {
    const tbody = document.getElementById('regTableBody');
    if (!tbody) return;

    const searchQuery = document.getElementById('adminSearch').value.toLowerCase().trim();
    const roleFilter = document.getElementById('filterRole').value;
    const statusFilter = document.getElementById('filterStatus').value;

    // Filter registrations
    const filtered = registrations.filter(reg => {
        // Role filter
        if (roleFilter !== 'all' && reg.role !== roleFilter) return false;
        
        // Status filter
        if (statusFilter !== 'all' && reg.status !== statusFilter) return false;
        
        // Search query
        if (searchQuery) {
            const matchesName = reg.name.toLowerCase().includes(searchQuery);
            const matchesEmail = reg.email.toLowerCase().includes(searchQuery);
            const matchesPhone = reg.phone.toLowerCase().includes(searchQuery);
            
            let matchesDetail = false;
            if (reg.details) {
                if (reg.details.program) matchesDetail = reg.details.program.toLowerCase().includes(searchQuery);
                if (reg.details.motivation) matchesDetail = matchesDetail || reg.details.motivation.toLowerCase().includes(searchQuery);
                if (reg.details.message) matchesDetail = matchesDetail || reg.details.message.toLowerCase().includes(searchQuery);
                if (reg.details.organization) matchesDetail = matchesDetail || reg.details.organization.toLowerCase().includes(searchQuery);
            }
            
            return matchesName || matchesEmail || matchesPhone || matchesDetail;
        }

        return true;
    });

    // Sort: newest first
    filtered.sort((a, b) => {
        // Extract timestamps if ID is in format "reg_12345"
        const tA = parseInt(a.id.replace('reg_', '')) || 0;
        const tB = parseInt(b.id.replace('reg_', '')) || 0;
        return tB - tA;
    });

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="table-empty">
                        <i class="fa-solid fa-folder-open"></i>
                        <h3>No registrations found</h3>
                        <p>Try adjusting your filters or search keywords.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    filtered.forEach(reg => {
        const tr = document.createElement('tr');
        
        // Format Date
        let formattedDate = reg.date;
        try {
            const d = new Date(reg.date);
            if (!isNaN(d.getTime())) {
                formattedDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }
        } catch(e) {}

        tr.innerHTML = `
            <td>
                <div class="user-info">
                    <span class="user-name">${escapeHTML(reg.name)}</span>
                    <span class="user-email">${escapeHTML(reg.email)}</span>
                </div>
            </td>
            <td>
                <span class="role-badge ${reg.role}">${escapeHTML(reg.role)}</span>
            </td>
            <td>
                <span class="user-phone">${escapeHTML(reg.phone)}</span>
            </td>
            <td>${formattedDate}</td>
            <td>
                <span class="status-badge ${reg.status}">${reg.status}</span>
            </td>
            <td>
                <div class="row-actions">
                    <button class="action-icon-btn view" onclick="openDetailsModal('${reg.id}')" title="View details">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    ${reg.status === 'pending' ? `
                        <button class="action-icon-btn approve" onclick="quickUpdateStatus('${reg.id}', 'approved')" title="Approve">
                            <i class="fa-solid fa-check"></i>
                        </button>
                        <button class="action-icon-btn reject" onclick="quickUpdateStatus('${reg.id}', 'rejected')" title="Reject">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    ` : ''}
                    <button class="action-icon-btn delete" onclick="deleteRegistration('${reg.id}')" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// ====================================
//   MODAL ACTIONS
// ====================================

const adminDetailsModal = document.getElementById('adminDetailsModal');
const closeAdminModalBtn = document.getElementById('closeAdminModalBtn');
const adminModalOverlay = document.getElementById('adminModalOverlay');

window.openDetailsModal = function(id) {
    const reg = registrations.find(r => r.id === id);
    if (!reg) return;

    selectedRegId = id;

    // Set Name & Status
    document.getElementById('modalTitleName').textContent = reg.name;
    
    // Build details grid HTML
    const grid = document.getElementById('modalDetailsGrid');
    
    let roleSpecificHtml = '';
    
    if (reg.role === 'student') {
        roleSpecificHtml = `
            <div class="detail-item">
                <label>Program of Interest</label>
                <span>${escapeHTML(reg.details.program)}</span>
            </div>
            <div class="detail-item">
                <label>Current Status</label>
                <span>${escapeHTML(reg.details.status)}</span>
            </div>
            <div class="detail-item ${reg.details.linkedin ? '' : 'full-width'}">
                <label>Phone Number</label>
                <span>${escapeHTML(reg.phone)}</span>
            </div>
            ${reg.details.linkedin ? `
                <div class="detail-item">
                    <label>LinkedIn</label>
                    <a href="${escapeHTML(reg.details.linkedin)}" target="_blank" style="color: var(--primary); text-decoration: underline;">
                        ${escapeHTML(reg.details.linkedin)}
                    </a>
                </div>
            ` : ''}
            <div class="detail-item full-width">
                <label>Motivation / Statement</label>
                <p>${escapeHTML(reg.details.motivation)}</p>
            </div>
        `;
    } else if (reg.role === 'mentor' || reg.role === 'volunteer' || reg.role === 'partner') {
        const showOrg = reg.details.organization;
        const showWeb = reg.details.website;
        
        roleSpecificHtml = `
            <div class="detail-item ${showOrg ? '' : 'full-width'}">
                <label>Phone Number</label>
                <span>${escapeHTML(reg.phone)}</span>
            </div>
            ${showOrg ? `
                <div class="detail-item">
                    <label>Organization / Company</label>
                    <span>${escapeHTML(reg.details.organization)}</span>
                </div>
            ` : ''}
            ${showWeb ? `
                <div class="detail-item full-width">
                    <label>Website / LinkedIn</label>
                    <a href="${escapeHTML(reg.details.website)}" target="_blank" style="color: var(--primary); text-decoration: underline;">
                        ${escapeHTML(reg.details.website)}
                    </a>
                </div>
            ` : ''}
            <div class="detail-item full-width">
                <label>Collaboration details / message</label>
                <p>${escapeHTML(reg.details.message)}</p>
            </div>
        `;
    } else if (reg.role === 'supporter') {
        roleSpecificHtml = `
            <div class="detail-item">
                <label>Area of Interest</label>
                <span style="text-transform: capitalize;">${escapeHTML(reg.details.interest.replace('_', ' '))}</span>
            </div>
            <div class="detail-item">
                <label>Organization</label>
                <span>${escapeHTML(reg.details.organization) || 'None'}</span>
            </div>
            <div class="detail-item full-width">
                <label>Supporter List Status</label>
                <p>Registered for updates and early supporter launches.</p>
            </div>
        `;
    } else {
        // Fallback for general inquiries
        roleSpecificHtml = `
            <div class="detail-item full-width">
                <label>Message</label>
                <p>${escapeHTML(reg.details.message || 'No details available.')}</p>
            </div>
        `;
    }

    grid.innerHTML = `
        <div class="detail-item">
            <label>Registration ID</label>
            <span>${reg.id}</span>
        </div>
        <div class="detail-item">
            <label>Registration Date</label>
            <span>${reg.date}</span>
        </div>
        <div class="detail-item">
            <label>Role Type</label>
            <span class="role-badge ${reg.role}">${reg.role}</span>
        </div>
        <div class="detail-item">
            <label>Email Address</label>
            <span>${escapeHTML(reg.email)}</span>
        </div>
        ${roleSpecificHtml}
    `;

    // Set Status dropdown in modal
    document.getElementById('modalStatusSelect').value = reg.status;

    if (adminDetailsModal) {
        adminDetailsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeDetailsModal() {
    if (adminDetailsModal) {
        adminDetailsModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    selectedRegId = null;
}

if (closeAdminModalBtn) closeAdminModalBtn.addEventListener('click', closeDetailsModal);
if (adminModalOverlay) adminModalOverlay.addEventListener('click', closeDetailsModal);

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminDetailsModal && adminDetailsModal.classList.contains('active')) {
        closeDetailsModal();
    }
});

// ====================================
//   DATABASE MUTATIONS
// ====================================

window.quickUpdateStatus = function(id, newStatus) {
    const reg = registrations.find(r => r.id === id);
    if (!reg) return;

    reg.status = newStatus;
    saveDatabase();
    updateStatsUI();
    renderTable();
    showToast(`Status updated to '${newStatus}' for ${reg.name}`);
};

window.modalUpdateStatus = function() {
    if (!selectedRegId) return;
    const select = document.getElementById('modalStatusSelect');
    if (!select) return;

    const newStatus = select.value;
    quickUpdateStatus(selectedRegId, newStatus);
    closeDetailsModal();
};

window.deleteRegistration = function(id) {
    const reg = registrations.find(r => r.id === id);
    if (!reg) return;

    if (confirm(`Are you sure you want to delete registration for ${reg.name}?`)) {
        registrations = registrations.filter(r => r.id !== id);
        saveDatabase();
        updateStatsUI();
        renderTable();
        showToast(`Deleted registration for ${reg.name}`);
        if (selectedRegId === id) {
            closeDetailsModal();
        }
    }
};

window.exportDatabase = function() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(registrations, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href",     dataStr);
    downloadAnchor.setAttribute("download", `afrilumina_registrations_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Database exported successfully!");
};

window.resetDatabase = function() {
    if (confirm("Are you sure you want to reset the database? This will clear recent signups and restore the default seed data.")) {
        localStorage.setItem('afrilumina_registrations', JSON.stringify(defaultRegistrations));
        registrations = [...defaultRegistrations];
        updateStatsUI();
        renderTable();
        showToast("Database reset to original seed data.");
    }
};

// ====================================
//   EVENT LISTENERS INITIALIZATION
// ====================================

function initAdminPortal() {
    loadDatabase();
    updateStatsUI();
    renderTable();

    // Bind filters
    const searchInput = document.getElementById('adminSearch');
    const roleSelect = document.getElementById('filterRole');
    const statusSelect = document.getElementById('filterStatus');

    if (searchInput) {
        searchInput.addEventListener('input', renderTable);
    }
    if (roleSelect) {
        roleSelect.addEventListener('change', renderTable);
    }
    if (statusSelect) {
        statusSelect.addEventListener('change', renderTable);
    }
    
    // Force active class on scroll reveal elements in case they are already visible
    setTimeout(() => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => el.classList.add('active'));
    }, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPortal);
} else {
    initAdminPortal();
}
