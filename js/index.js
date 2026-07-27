// !======================= Start Global Variables
var contactModal = document.getElementById("contactModal");
var totalContacts = document.getElementById("totalContacts");
var totalFavContacts = document.getElementById("totalFavContacts");
var totalEmergencyContacts = document.getElementById("totalEmergencyContacts");
var totalContactsSpan = document.getElementById("totalContactsSpan");
var addContactBtn = document.getElementById("addContactBtn");
var searchInput = document.getElementById("searchInput");
var contactCardContainer = document.getElementById("contactCardContainer");

var contactForm = document.getElementById("contactForm");
var avatarPreview = document.getElementById("avatarPreview");
var avatarInput = document.getElementById("avatarInput");
var avatarPath = document.getElementById("avatarPath");
var contactName = document.getElementById("contactName");
var contactPhone = document.getElementById("contactPhone");
var contactEmail = document.getElementById("contactEmail");
var contactAddress = document.getElementById("contactAddress");
var contactGroup = document.getElementById("contactGroup");
var contactNotes = document.getElementById("contactNotes");
var contactFavorite = document.getElementById("contactFavorite");
var contactEmergency = document.getElementById("contactEmergency");

var submitModalBtn = document.getElementById("submitModalBtn");
var closeModalBtn = document.getElementById("closeModalBtn");
var cancelModalBtn = document.getElementById("cancelModalBtn");

var contactList = [];

// Load from localStorage
if (localStorage.getItem("contacts") !== null) {
    contactList = JSON.parse(localStorage.getItem("contacts"));
    displayData();
} else {
    contactList = [];
    displayData();
}

// !======================= Event Listeners
addContactBtn.addEventListener("click", function () {
    currentUpdateIndex = null;
    clearForm();
    contactModal.classList.add("d-flex");
    contactModal.classList.remove("d-none");
});

closeModalBtn.addEventListener("click", function () {
    contactModal.classList.add("d-none");
    contactModal.classList.remove("d-flex");
    clearForm();
});

cancelModalBtn.addEventListener("click", function () {
    contactModal.classList.add("d-none");
    contactModal.classList.remove("d-flex");
    clearForm();
});

submitModalBtn.addEventListener("click", function (e) {
    e.preventDefault();

    var success = false;

    if (currentUpdateIndex === null) {
        success = addContact();
    } else {
        updateData();
        success = true;
    }

    if (success) {
        contactModal.classList.add("d-none");
        contactModal.classList.remove("d-flex");
    }
});
searchInput.addEventListener("input", function () {
    displayData();
});

function getCardHtml(i) {
    var initials = contactList[i].userName ? contactList[i].userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
    var avatarColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
    var bgColor = avatarColors[i % avatarColors.length];

    return `
    <div class="col-md-6 col-lg-12 col-xl-6">
        <div class="contact-card border-0">
            <div class="contact-card-header d-flex align-items-center gap-3">
                <div class="position-relative flex-shrink-0">
                    ${contactList[i].userImage ?
                        `<img src="${contactList[i].userImage}" alt="avatar" class="contact-card-avatar">` :
                        `<div class="contact-card-avatar-placeholder d-flex align-items-center justify-content-center text-white shadow-sm" style="background-color: ${bgColor}; font-size: 1.25rem; font-weight: 700;">
                            ${initials}
                        </div>`
                    }
                    <div class="badge-icon badge-star position-absolute z-3 ${contactList[i].userFavorite ? "" : "v-hidden"}" style="top: -5px; right: -5px;">
                        <i class="fas fa-star text-white"></i>
                    </div>
                    <div class="badge-icon badge-heart position-absolute z-2 ${contactList[i].userEmergency ? "" : "v-hidden"}" style="bottom: -5px; right: -5px;">
                        <i class="fas fa-heart-pulse text-white"></i>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="contact-card-name truncate m-0 fw-bold" style="color: #111827; font-size: 18px;">${contactList[i].userName}</h3>
                    <div class="d-flex align-items-center gap-2 mt-1">
                        <div class="icon-box-small blue">
                            <i class="fas fa-phone"></i>
                        </div>
                        <span class="contact-card-phone truncate text-secondary" style="font-size: 14px;">${contactList[i].userPhone || '0123456789'}</span>
                    </div>
                </div>
            </div>

            <div class="contact-details">
                <div class="mb-2 d-flex align-items-center gap-2">
                    <div class="icon-box-small violet">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <span class="truncate text-secondary" style="font-size: 13px;">${contactList[i].userEmail || 'No Email'}</span>
                </div>
                <div class="mb-3 d-flex align-items-center gap-2">
                    <div class="icon-box-small emerald">
                        <i class="fas fa-location-dot"></i>
                    </div>
                    <span class="truncate text-secondary" style="font-size: 13px;">${contactList[i].userAddress || 'No Address'}</span>
                </div>
                <div class="contact-tags d-flex gap-2">
                    ${contactList[i].userGroup ? `<span class="tag tag-group">${contactList[i].userGroup}</span>` : ''}
                    ${contactList[i].userEmergency ? `<span class="tag tag-emergency"><i class="fas fa-heart-pulse me-1"></i> Emergency</span>` : ''}
                </div>
            </div>

            <div class="contact-card-footer d-flex justify-content-between align-items-center">
                <div class="d-flex gap-2">
                    <a href="tel:${contactList[i].userPhone}" class="btn-action-square green" title="Call">
                        <i class="fas fa-phone"></i>
                    </a>
                    <a href="mailto:${contactList[i].userEmail}" class="btn-action-square violet" title="Email">
                        <i class="fas fa-envelope"></i>
                    </a>
                </div>
                <div class="d-flex gap-1">
                    <button class="btn-action-square yellow ${contactList[i].userFavorite ? 'active' : ''}" onclick="toggleFavorite(${i})">
                        <i class="fa-${contactList[i].userFavorite ? 'solid' : 'regular'} fa-star"></i>
                    </button>
                    <button class="btn-action-square red ${contactList[i].userEmergency ? 'active' : ''}" onclick="toggleEmergency(${i})">
                        <i class="fa-${contactList[i].userEmergency ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                    <button class="btn-action-square gray" onclick="setData(${i})">
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn-action-square gray" onclick="deleteContact(${i})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}

function displayData() {
    var term = searchInput.value.toLowerCase();
    var cartona = "";

    var filteredList = contactList.filter(c =>
        c.userName.toLowerCase().includes(term) ||
        c.userPhone.includes(term) ||
        c.userEmail.toLowerCase().includes(term)
    );

    if (filteredList.length === 0) {
        cartona = `
        <div class="col-12 text-center py-5">
            <div class="d-flex align-items-center justify-content-center mx-auto mb-4 bg-secondary-subtle rounded-4" style="width: 80px; height: 80px;">
                <i class="fas fa-address-book text-secondary fs-4"></i>
            </div>
            <p class="text-muted fw-semibold mb-1">No contacts found</p>
        </div>`;
    } else {
        for (var i = 0; i < contactList.length; i++) {
            if (contactList[i].userName.toLowerCase().includes(term) ||
                contactList[i].userPhone.includes(term) ||
                contactList[i].userEmail.toLowerCase().includes(term)) {
                cartona += getCardHtml(i);
            }
        }
    }
    contactCardContainer.innerHTML = cartona;
    updateStats();
}





function addContact() {

    if (
        !validateInput(contactName, nameRegex) ||
        !validateInput(contactPhone, phoneRegex) ||
        !validateInput(contactEmail, emailRegex) ||
        !validateInput(contactAddress, addressRegex) ||
        !validateInput(contactGroup, groupRegex) ||
        !validateInput(contactNotes, notesRegex)
    ) {

        Swal.fire({
            icon: "error",
            title: "Missing Name",
            text: "Please enter a name for the contact!"
        });

        return false;
    }

    var contact = {
        userName: contactName.value,
        userPhone: contactPhone.value,
        userEmail: contactEmail.value,
        userAddress: contactAddress.value,
        userGroup: contactGroup.value,
        userNotes: contactNotes.value,
        userFavorite: contactFavorite.checked,
        userEmergency: contactEmergency.checked,
        userImage: avatarPath.value
    };

    contactList.push(contact);
    localStorage.setItem("contacts", JSON.stringify(contactList));

    Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Contact has been updated successfully."
    });

    clearForm();
    displayData();

    return true;
}

// ================= Regex

var nameRegex = /^[A-Za-z ]{3,20}$/;
var phoneRegex = /^01[0125][0-9]{8}$/;
var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var addressRegex = /^[A-Za-z0-9\s,.-]{5,100}$/;
var groupRegex = /^[A-Za-z\s]{3,20}$/;
var notesRegex = /^.{0,200}$/;

// ================= Validation Function

function validateInput(element, regex) {

    if (regex.test(element.value)) {
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");
        return true;
    } else {
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
        return false;
    }

}

// ================= Events

contactName.addEventListener("input", function () {
    validateInput(contactName, nameRegex);
});

contactPhone.addEventListener("input", function () {
    validateInput(contactPhone, phoneRegex);
});

contactEmail.addEventListener("input", function () {
    validateInput(contactEmail, emailRegex);
});

contactAddress.addEventListener("input", function () {
    validateInput(contactAddress, addressRegex);
});

contactGroup.addEventListener("input", function () {
    validateInput(contactGroup, groupRegex);
});

contactNotes.addEventListener("input", function () {
    validateInput(contactNotes, notesRegex);
});















function clearForm() {
    contactName.value = "";
    contactPhone.value = "";
    contactEmail.value = "";
    contactAddress.value = "";
    contactGroup.value = "";
    contactNotes.value = "";
    contactFavorite.checked = false;
    contactEmergency.checked = false;
    avatarPath.value = "";
    avatarPreview.innerHTML = '<i class="fas fa-user"></i>';
}

function deleteContact(index) {
    contactList.splice(index, 1);
    localStorage.setItem("contacts", JSON.stringify(contactList));
    displayData();
}

function updateStats() {
    var total = contactList.length;
    var favorites = contactList.filter(c => c.userFavorite);
    var emergency = contactList.filter(c => c.userEmergency);

    if (totalContacts) totalContacts.innerHTML = total;
    if (totalContactsSpan) totalContactsSpan.innerHTML = total;
    if (totalFavContacts) totalFavContacts.innerHTML = favorites.length;
    if (totalEmergencyContacts) totalEmergencyContacts.innerHTML = emergency.length;

    // Render Sidebar Favorites
    var favListContainer = document.getElementById("favListContainer");
    if (favListContainer) {
        if (favorites.length === 0) {
            favListContainer.innerHTML = `<div class="py-4 text-center text-muted small">No favorites yet</div>`;
        } else {
            favListContainer.innerHTML = "";
            favorites.forEach((fav, idx) => {
                var initials = fav.userName ? fav.userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
                var avatarColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
                var bgColor = avatarColors[idx % avatarColors.length];
                favListContainer.innerHTML += `
                <div class="sidebar-item fav-row d-flex align-items-center justify-content-between p-2 rounded-4 mb-2">
                    <div class="d-flex align-items-center gap-2 overflow-hidden">
                        <div class="avatar-sm rounded-3 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style="background-color: ${bgColor}; width: 38px; height: 38px; font-size: 11px; flex-shrink: 0;">
                            ${initials}
                        </div>
                        <div class="overflow-hidden">
                            <h4 class="small m-0 text-truncate fw-bold" style="font-size: 13px;">${fav.userName}</h4>
                            <p class="mb-0 text-secondary" style="font-size: 11px;">${fav.userPhone}</p>
                        </div>
                    </div>
                    <a href="tel:${fav.userPhone}" class="btn-action-small-solid green">
                        <i class="fas fa-phone"></i>
                    </a>
                </div>`;
            });
        }
    }

    // Render Sidebar Emergency
    var emergencyListContainer = document.getElementById("emergencyListContainer");
    if (emergencyListContainer) {
        if (emergency.length === 0) {
            emergencyListContainer.innerHTML = `<div class="py-4 text-center text-muted small">No emergency contacts</div>`;
        } else {
            emergencyListContainer.innerHTML = "";
            emergency.forEach((emg, idx) => {
                var initials = emg.userName ? emg.userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : '??';
                var avatarColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
                var bgColor = avatarColors[(idx+2) % avatarColors.length];
                emergencyListContainer.innerHTML += `
                <div class="sidebar-item emg-row d-flex align-items-center justify-content-between p-2 rounded-4 mb-2">
                    <div class="d-flex align-items-center gap-2 overflow-hidden">
                        <div class="avatar-sm rounded-3 d-flex align-items-center justify-content-center text-white fw-bold shadow-sm" style="background-color: ${bgColor}; width: 38px; height: 38px; font-size: 11px; flex-shrink: 0;">
                            ${initials}
                        </div>
                        <div class="overflow-hidden">
                            <h4 class="small m-0 text-truncate fw-bold" style="font-size: 13px;">${emg.userName}</h4>
                            <p class="mb-0 text-secondary" style="font-size: 11px;">${emg.userPhone}</p>
                        </div>
                    </div>
                    <a href="tel:${emg.userPhone}" class="btn-action-small-solid red">
                        <i class="fas fa-phone"></i>
                    </a>
                </div>`;
            });
        }
    }
}

// Update Logic
var currentUpdateIndex = null;

function setData(updateIndex) {
    currentUpdateIndex = updateIndex;
    var contact = contactList[updateIndex];
    contactName.value = contact.userName;
    contactPhone.value = contact.userPhone;
    contactEmail.value = contact.userEmail;
    contactAddress.value = contact.userAddress;
    contactGroup.value = contact.userGroup;
    contactNotes.value = contact.userNotes;
    contactEmergency.checked = contact.userEmergency;
    contactFavorite.checked = contact.userFavorite;

    contactModal.classList.remove("d-none");
    contactModal.classList.add("d-flex");
}

function updateData() {
    contactList[currentUpdateIndex] = {
        userName: contactName.value,
        userPhone: contactPhone.value,
        userEmail: contactEmail.value,
        userAddress: contactAddress.value,
        userGroup: contactGroup.value,
        userNotes: contactNotes.value,
        userFavorite: contactFavorite.checked,
        userEmergency: contactEmergency.checked,
        userImage: avatarPath.value
    };

    localStorage.setItem("contacts", JSON.stringify(contactList));
    displayData();
    clearForm();
    currentUpdateIndex = null;
}

// Interactivity Logic
function toggleFavorite(index) {
    contactList[index].userFavorite = !contactList[index].userFavorite;
    localStorage.setItem("contacts", JSON.stringify(contactList));
    displayData();
}

function toggleEmergency(index) {
    contactList[index].userEmergency = !contactList[index].userEmergency;
    localStorage.setItem("contacts", JSON.stringify(contactList));
    displayData();
}
