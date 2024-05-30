//fonction initialisation 
function init() {
    getContacts();
    document.getElementById('add-contact-btn').addEventListener('click', showFormAjout);
    document.getElementById('clear-form-btn').addEventListener('click', suppForm);
    document.getElementById('clear-all-btn').addEventListener('click', suppAllContacts);
}
// function pour adjustleftdivheight
function adjustLeftDivHeight() {
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    var contactCount = contacts.length;
    var leftDiv = document.querySelector('.left');
    if (contactCount > 0) {
        leftDiv.style.maxHeight = 'none';
    } else {
        leftDiv.style.maxHeight = '101.5px';
    }
}
//function get contacts
function getContacts() {
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    afficherContacts(contacts);
}
//function showformAjout
function showFormAjout() {
    var contactForm = document.getElementById('contact-form');
    document.getElementById('clear-contact-btn').style.display = 'none';
    document.getElementById('save-contact-btn').removeEventListener('click', modifierContact);
    if (contactForm.style.display === 'none' || contactForm.style.display === '') {
        var allContactElements = document.querySelectorAll('.contact');
        allContactElements.forEach(function(element) {
            if (element !== document.getElementById('contact')) {
                element.classList.remove('clicked');
            }
        });
        document.getElementById('civilite').value = '';
        document.getElementById('nom').value = '';
        document.getElementById('prenom').value = '';
        document.getElementById('telephone').value = '';
        document.getElementById('contact-details').style.display = 'none';
        contactForm.style.display = 'block';
        adjustLeftDivHeight(); 
        document.getElementById('save-contact-btn').removeEventListener('click', modifierContact);
        document.getElementById('save-contact-btn').addEventListener('click', EnregistrerContact);
    } else {
        contactForm.style.display = 'none';
    }
}
//function affichercontacts
function afficherContacts(contacts) {
    var contactList = document.getElementById('contact-list');
    contacts.sort(function(a, b) {
        var firstNameA = a.prenom.toUpperCase();
        var firstNameB = b.prenom.toUpperCase();
        if (firstNameA < firstNameB) {
            return -1;
        }
        if (firstNameA > firstNameB) {
            return 1;
        }
        var nameA = a.nom.toUpperCase();
        var nameB = b.nom.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    if (contacts.length !== 0) {
        contactList.innerHTML = '<h2>Contacts enregistrés</h2>';
        contacts.forEach(function(contact) {
            var contactElement = document.createElement('div');
            contactElement.classList.add('contact');
            var contactBox = document.createElement('div');
            contactBox.classList.add('contact-box');
            var icon = document.createElement('img');
            icon.src = './image/user.png';
            icon.alt = 'Person icon';
            icon.classList.add('person-icon');
            var span = document.createElement('span');
            span.textContent = contact.prenom + ' ' + contact.nom.toUpperCase();
            contactBox.appendChild(icon);
            contactBox.appendChild(span);
            contactElement.appendChild(contactBox);
            contactElement.addEventListener('click', function() {
                contactElement.classList.toggle('clicked');
                showContactDetails(contact);            
                var allContactElements = document.querySelectorAll('.contact');
                allContactElements.forEach(function(element) {
                    if (element !== contactElement) {
                        element.classList.remove('clicked');
                    }
                });
            });
            contactList.appendChild(contactElement);
        });
    } 
}
// function validatephonenumber
function validatePhoneNumber(phoneNumber) {
    var phoneRegex = /^\d{8}$/;
    return phoneRegex.test(phoneNumber);
}
//function Enregistre Contact
function EnregistrerContact(event) {
    event.preventDefault();
    var civilite = document.getElementById('civilite').value;
    var nom = document.getElementById('nom').value;
    var prenom = document.getElementById('prenom').value;
    var tel = document.getElementById('telephone').value;

    if (!validatePhoneNumber(tel)) {
        alert('Le numéro de téléphone doit contenir exactement 8 chiffres.');
        return;
    }

    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    var contactExists = contacts.some(function (contact) {
        return contact.telephone === tel;
    });
    if (contactExists) {
        alert('Ce contact existe déjà.');
        return;
    }

    var newContact = { 
        civilite: civilite, 
        nom: nom, 
        prenom: prenom, 
        telephone: tel 
    };
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    contacts.push(newContact);
    localStorage.setItem('contacts', JSON.stringify(contacts));

    getContacts();
    document.getElementById('contact-form').style.display = 'none';
    suppForm();
}



//function suppForm
function suppForm() {
    document.getElementById('add-contact-form').reset();
}
// functopn suppallcontacts
function suppAllContacts() {
    localStorage.removeItem('contacts');
    getContacts();
    document.getElementById('contact-list').innerHTML = '<h2>Contacts enregistrés</h2><p>Aucun contact enregistré</p>';
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('contact-details').style.display = 'none';
}
//function showcontatdetails
function showContactDetails(contact) {
    var contactList = document.querySelectorAll('.contact');
    var isContactClicked = false;

    contactList.forEach(function(element) {
        if (element.classList.contains('clicked')) {
            isContactClicked = true;
        }
    });

    var detailsDiv = document.getElementById('contact-details');


    if (isContactClicked) {
        document.getElementById('contact-form').style.display = 'none';
        detailsDiv.style.display = 'block';
    } else {
        document.getElementById('contact-form').style.display = 'none';
        detailsDiv.style.display = 'none';
    }

    detailsDiv.innerHTML = '<div class="contact-details-item">' +
        '<p>' + contact.civilite + ' ' + contact.prenom + ' ' + contact.nom.toUpperCase() + '</p>' +
        '<p>Tel: ' + contact.telephone + '</p>' +
        '<button id="edit-contact-btn">Editer le contact</button>' +
        '</div>';

    var editButton = detailsDiv.querySelector('#edit-contact-btn');
    editButton.addEventListener('click', function() {
        showEditForm(contact);
    });
}

//fonction showeditform
function showEditForm(contact) {
    document.getElementById('clear-contact-btn').style.display = 'block';
    document.getElementById('contact-details').style.display = 'none';
    document.getElementById('civilite').value = contact.civilite;
    document.getElementById('nom').value = contact.nom;
    document.getElementById('prenom').value = contact.prenom;
    document.getElementById('telephone').value = contact.telephone;
    document.getElementById('save-contact-btn').removeEventListener('click', EnregistrerContact);
    document.getElementById('save-contact-btn').addEventListener('click', function() {
        modifierContact(contact);
    });
    document.getElementById('clear-contact-btn').addEventListener('click', function() {
        suppSelectedContactBox(contact);
    });
    document.getElementById('contact-form').style.display = 'block';
}
//fonction modifier contact
function modifierContact(contact) {
    contact.civilite = document.getElementById('civilite').value;
    contact.nom = document.getElementById('nom').value;
    contact.prenom = document.getElementById('prenom').value;
    contact.telephone = document.getElementById('telephone').value;
    if (!validatePhoneNumber(contact.telephone)) {
        alert('Le numéro de téléphone doit contenir exactement 8 chiffres.');
        return;
    }
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    var index = contacts.findIndex(function(item) {
        return item.telephone === contact.telephone;
    });
    contacts[index] = contact;
    localStorage.setItem('contacts', JSON.stringify(contacts));
    getContacts();
    showContactDetails(contact);
    document.getElementById('save-contact-btn').removeEventListener('click', modifierContact);
    document.getElementById('contact-form').style.display = 'none';

}
//fonction supp selected contact box
function suppSelectedContactBox(contact) {
    var contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    var index = contacts.findIndex(function(item) {
        return item.telephone === contact.telephone;
    });
    contacts.splice(index, 1); 
    localStorage.setItem('contacts', JSON.stringify(contacts)); 
    getContacts(); 
    adjustLeftDivHeight();
    document.getElementById('contact-form').style.display = 'none';
}

// fonction main
document.addEventListener('DOMContentLoaded', init);