// --- Existing Theme Toggle Functionality (Keep As Is) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCnUHUmNJ2bqnnTNXmO8tETPREgacVLOHE",
    authDomain: "test-auth-e5070.firebaseapp.com",
    projectId: "test-auth-e5070",
    storageBucket: "test-auth-e5070.firebasestorage.app",
    messagingSenderId: "791046207262",
    appId: "1:791046207262:web:baa317c3c96aa15922bb0f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider(app);
const db = getFirestore(app);


const signInRegisterBtn = document.getElementById('signInRegisterBtn');
    if (signInRegisterBtn) {
        signInRegisterBtn.addEventListener('click', () => {
            // Navigate to the login page when the button is clicked
            window.location.href = 'login.html'; 
        });
    } else {
        console.warn("Sign In/Register button (#signInRegisterBtn) not found.");
    }


    
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null; // Added null check
let isDarkTheme = localStorage.getItem('theme') === 'dark';

function applyDarkTheme() {
    document.body.classList.add('dark-theme');
    if (themeIcon) {
        themeIcon.classList.remove('ri-sun-line');
        themeIcon.classList.add('ri-moon-line');
    }
    // Update button styles for dark theme
    document.querySelectorAll('button, a.bg-primary, a.bg-white').forEach(button => {
        // Simplified logic, assuming your CSS handles dark theme button states primarily
        // You might need to adjust this part based on your specific dark theme CSS
        if (button.classList.contains('bg-primary')) {
            button.classList.add('dark:hover:bg-primary/80'); // Example adjustment
        } else if (button.classList.contains('bg-white')) {
            // Assuming Tailwind's dark: prefix handles this in CSS
        }
    });
}

function applyLightTheme() {
    document.body.classList.remove('dark-theme');
    if (themeIcon) {
        themeIcon.classList.remove('ri-moon-line');
        themeIcon.classList.add('ri-sun-line');
    }
    // Restore button styles for light theme
    document.querySelectorAll('button, a.bg-primary, a.bg-gray-700').forEach(button => {
        // Assuming Tailwind handles light theme states by default
        if (button.classList.contains('bg-primary')) {
            button.classList.remove('dark:hover:bg-primary/80');
        }
    });
}

function initializeTheme() {
    if (localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDarkTheme = true;
        applyDarkTheme(); // Apply dark theme styles immediately
    } else {
        isDarkTheme = false;
        // Light theme is default, potentially apply specific light styles if needed
        applyLightTheme(); // Apply light theme styles
    }
}

initializeTheme(); // Initialize theme early

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
        isDarkTheme = !isDarkTheme;
        if (isDarkTheme) {
            applyDarkTheme();
            localStorage.setItem('theme', 'dark');
        } else {
            applyLightTheme();
            localStorage.setItem('theme', 'light');
        }
    });
}


// --- Existing Mobile Menu Toggle (Keep As Is) ---
const menuToggle = document.querySelector('.ri-menu-line');
if (menuToggle && menuToggle.parentElement) {
    menuToggle.parentElement.addEventListener('click', function () {
        const nav = document.querySelector('header nav'); // Target nav inside header
        if (nav) {
            nav.classList.toggle('hidden');
        }
    });
}

// --- Existing Home Link Functionality (Keep As Is) ---
const homeLink = document.querySelector('header a[href="#"]'); // More specific selector
if (homeLink) {
    homeLink.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- Existing Form Tabs Functionality (Keep As Is) ---
const tabs = {
    location: {
        tab: document.getElementById('location-tab'),
        content: document.getElementById('location-content')
    },
    animal: {
        tab: document.getElementById('animal-tab'),
        content: document.getElementById('animal-content')
    },
    photos: {
        tab: document.getElementById('photos-tab'),
        content: document.getElementById('photos-content')
    },
    contact: {
        tab: document.getElementById('contact-tab'),
        content: document.getElementById('contact-content')
    }
};

function switchTab(activeTabId) {
    let activeTabFound = false;
    Object.values(tabs).forEach(({ tab, content }) => {
        if (tab && content) { // Check if elements exist
            content.classList.add('hidden');
            tab.classList.remove('text-primary', 'border-b-2', 'border-primary');
            tab.classList.add('text-gray-500'); // Use Tailwind class
        }
    });

    if (tabs[activeTabId] && tabs[activeTabId].tab && tabs[activeTabId].content) {
        const activeTab = tabs[activeTabId].tab;
        const activeContent = tabs[activeTabId].content;
        activeContent.classList.remove('hidden');
        activeTab.classList.remove('text-gray-500');
        activeTab.classList.add('text-primary', 'border-b-2', 'border-primary');
        activeTabFound = true;
    }

    // Special handling: Invalidate map size when location tab becomes visible
    if (activeTabId === 'location' && typeof leafletMap !== 'undefined' && leafletMap) {
        setTimeout(() => leafletMap.invalidateSize(), 100); // Delay slightly for rendering
    }

    return activeTabFound; // Indicate if tab switch was successful
}

// Tab click handlers
Object.keys(tabs).forEach(tabId => {
    if (tabs[tabId] && tabs[tabId].tab) {
        tabs[tabId].tab.addEventListener('click', () => switchTab(tabId));
    }
});

// Next/Back button handlers (ensure elements exist before adding listeners)
const nextToAnimalBtn = document.getElementById('next-to-animal');
const backToLocationBtn = document.getElementById('back-to-location');
const nextToPhotosBtn = document.getElementById('next-to-photos');
const backToAnimalBtn = document.getElementById('back-to-animal');
const nextToContactBtn = document.getElementById('next-to-contact');
const backToPhotosBtn = document.getElementById('back-to-photos');

if (nextToAnimalBtn) nextToAnimalBtn.addEventListener('click', () => switchTab('animal'));
if (backToLocationBtn) backToLocationBtn.addEventListener('click', () => switchTab('location'));
if (nextToPhotosBtn) nextToPhotosBtn.addEventListener('click', () => switchTab('photos'));
if (backToAnimalBtn) backToAnimalBtn.addEventListener('click', () => switchTab('animal'));
if (nextToContactBtn) nextToContactBtn.addEventListener('click', () => switchTab('contact'));
if (backToPhotosBtn) backToPhotosBtn.addEventListener('click', () => switchTab('photos'));

// --- Existing Submit Form Handler (Keep As Is, check element exists) ---
const streetAddress = document.getElementById('street-address');
const city = document.getElementById('city');
const landmark = document.getElementById('landmark');
const dogradio = document.getElementById('dogradio');
const catradio = document.getElementById('catradio');
const birdradio = document.getElementById('birdradio');
const otheradio = document.getElementById('otheradio');
const healthradio = document.getElementById('healthradio');
const injuryradio = document.getElementById('injuryradio');
const urgentradio = document.getElementById('urgentradio');
const animalDesc = document.getElementById('animal_desc');
const notesDesc = document.getElementById('notes_desc');
const fullName = document.getElementById('full_name');
const userEmail = document.getElementById('user_email');
const userNum = document.getElementById('user_num');

const submitReportBtn = document.getElementById('submit-report');
if (submitReportBtn) {
    submitReportBtn.addEventListener('click', async function () {

        submitReportBtn.disabled = true;
        submitReportBtn.textContent = "Submitting...";

        const streetAddressValue = streetAddress.value;
        const cityValue = city.value;
        const landmarkValue = landmark.value;
        const dogradioValue = dogradio.value;
        const catradioValue = catradio.value;
        const birdradioValue = birdradio.value;
        const otheradioValue = otheradio.value;
        const healthradioValue = healthradio.value;
        const injuryradioValue = injuryradio.value;
        const urgentradioValue = urgentradio.value;
        const animalDescValue = animalDesc.value;
        const notesDescValue = notesDesc.value;
        const fullNameValue = fullName.value;
        const userEmailValue = userEmail.value;
        const userNumValue = userNum.value;

        // if (!firstName || !lastName || !courseId || !courseName) {
        //     statusDiv.textContent = "Error: Please fill in all fields.";
        //     statusDiv.style.color = 'red';
        //     submitReportBtn.disabled = false;
        //     return;
        // }

        const dataToSave = {};

        // Animal Details
        if (animalDescValue) {
          dataToSave.animalDetails = dataToSave.animalDetails || {};
          dataToSave.animalDetails.description = animalDescValue;
        }
        if (notesDescValue) {
          dataToSave.animalDetails = dataToSave.animalDetails || {};
          dataToSave.animalDetails.notes = notesDescValue;
        }
        if (Object.keys(dataToSave.animalDetails || {}).length === 0) {
          delete dataToSave.animalDetails;
        }
        
        // Location
        if (streetAddressValue) {
          dataToSave.location = dataToSave.location || {};
          dataToSave.location.streetAddress = streetAddressValue;
        }
        if (cityValue) {
          dataToSave.location = dataToSave.location || {};
          dataToSave.location.city = cityValue;
        }
        if (landmarkValue) {
          dataToSave.location = dataToSave.location || {};
          dataToSave.location.landmark = landmarkValue;
        }
        if (Object.keys(dataToSave.location || {}).length === 0) {
          delete dataToSave.location;
        }
        
        // Animal Type
        if (dogradio.checked) {
          dataToSave.animalType = 'dog';
        } else if (catradio.checked) {
          dataToSave.animalType = 'cat';
        } else if (birdradio.checked) {
          dataToSave.animalType = 'bird';
        } else if (otheradio.checked) {
          dataToSave.animalType = 'other';
        }
        
        // Urgency
        if (healthradio.checked) {
          dataToSave.urgency = 'healthIssue';
        } else if (injuryradio.checked) {
          dataToSave.urgency = 'injury';
        } else if (urgentradio.checked) {
          dataToSave.urgency = 'urgent';
        }
        
        // Reporter Details
        if (fullNameValue) {
          dataToSave.reporterDetails = dataToSave.reporterDetails || {};
          dataToSave.reporterDetails.fullName = fullNameValue;
        }
        if (userEmailValue) {
          dataToSave.reporterDetails = dataToSave.reporterDetails || {};
          dataToSave.reporterDetails.email = userEmailValue;
        }
        if (userNumValue) {
          dataToSave.reporterDetails = dataToSave.reporterDetails || {};
          dataToSave.reporterDetails.phoneNumber = userNumValue;
        }
        if (Object.keys(dataToSave.reporterDetails || {}).length === 0) {
          delete dataToSave.reporterDetails;
        }
        

        try {
            const collectionRef = collection(db, "Stray_Animal_Data");
            const docRef = await addDoc(collectionRef, dataToSave);

            submitReportBtn.textContent = `Submit Report`;
            submitReportBtn.style.color = 'white';

            // firstNameInput.value = lastNameInput.value = courseIdInput.value = courseNameInput.value = '';
            streetAddress.value = city.value = landmark.value = animalDesc.value = notesDesc.value = fullName.value = userEmail.value = userNum.value = "";
            dogradio.checked = catradio.checked = birdradio.checked = otheradio.checked = healthradio.checked = injuryradio.checked = urgentradio.checked = false;
        } catch (error) {
            console.error("Error writing document: ", error);
            submitReportBtn.textContent = `Error saving data: ${error.message}`;
            submitReportBtn.style.color = 'red';
        } finally {
            submitReportBtn.disabled = false;
        }
        // Create success message modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 flex items-center justify-center z-[100] bg-black bg-opacity-50'; // Higher z-index

        // Create modal content
        const modalContent = document.createElement('div');
        // Use Tailwind classes directly, check theme state
        modalContent.className = `relative max-w-md w-full mx-4 p-6 rounded-lg shadow-lg ${isDarkTheme ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`;

        modalContent.innerHTML = `
            <div class="w-16 h-16 ${isDarkTheme ? 'bg-green-900' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-4">
                <div class="w-8 h-8 flex items-center justify-center ${isDarkTheme ? 'text-green-400' : 'text-green-500'}">
                    <i class="ri-check-line ri-2x"></i>
                </div>
            </div>
            <h3 class="text-xl font-bold text-center mb-2">Report Submitted Successfully!</h3>
            <p class="${isDarkTheme ? 'text-gray-300' : 'text-gray-600'} text-center mb-6">Thank you for helping this animal in need. A rescue team will be notified and will respond as soon as possible.</p>
            <div class="flex justify-center">
                <button id="close-modal" class="bg-primary text-white px-6 py-2 !rounded-button whitespace-nowrap font-medium ${isDarkTheme ? 'hover:bg-primary/80' : 'hover:bg-primary/90'} transition">Close</button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close modal handler
        const closeModalBtn = document.getElementById('close-modal');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function () {
                if (modal.parentNode) { // Check if modal is still in DOM
                    modal.parentNode.removeChild(modal);
                }
                // Reset form and go back to first tab
                // Optional: Add form reset logic here if needed
                switchTab('location');
            });
        }
    });
}


// --- Existing Photo Upload Functionality (Keep As Is, minor improvements) ---
document.querySelectorAll('#photos-content input[type="file"]').forEach(input => {
    const container = input.parentElement; // Assuming input is direct child of the clickable div

    if (container && container.tagName === 'DIV') { // Ensure container is the div
        // Use a separate function for the change handler logic
        const handleFileChange = function () {
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    container.innerHTML = ''; // Clear previous content
                    container.style.backgroundImage = `url(${e.target.result})`;
                    container.style.backgroundSize = 'cover';
                    container.style.backgroundPosition = 'center';
                    container.classList.remove('border-dashed', 'p-4'); // Remove placeholder styles
                    container.classList.add('relative'); // Needed for absolute positioning of remove button

                    // Add a remove button (using Tailwind for styling)
                    const removeBtn = document.createElement('button');
                    removeBtn.type = 'button'; // Prevent form submission if inside a form
                    removeBtn.className = 'absolute top-1 right-1 bg-white text-gray-700 rounded-full p-1 shadow hover:bg-gray-100 z-10';
                    removeBtn.innerHTML = '<i class="ri-close-line text-sm"></i>'; // Smaller icon
                    container.appendChild(removeBtn);

                    removeBtn.addEventListener('click', function (ev) {
                        ev.stopPropagation(); // Prevent triggering the container click again
                        input.value = ''; // Clear the file input
                        container.style.backgroundImage = '';
                        container.classList.add('border-dashed', 'p-4'); // Restore placeholder styles
                        container.classList.remove('relative');
                        // Restore original content (important: re-add the hidden file input)
                        container.innerHTML = `
                            <div class="w-12 h-12 flex items-center justify-center text-gray-400 mb-2">
                                <i class="ri-add-circle-line ri-2x"></i>
                            </div>
                            <span class="text-gray-500 text-sm text-center">${container.dataset.placeholder || 'Click to upload photo'}</span>
                            <input type="file" class="hidden" accept="image/*">
                        `;
                        // Reattach listeners to the new input within the restored container
                        const newInput = container.querySelector('input[type="file"]');
                        if (newInput) {
                            newInput.addEventListener('change', handleFileChange); // Use the named function
                            // Store original placeholder text if needed for restoration
                            container.dataset.placeholder = container.querySelector('span').textContent;
                            // Re-bind the container click listener to trigger the new input
                            container.addEventListener('click', () => newInput.click(), { once: true }); // Re-bind click, maybe once
                        }
                    });
                };
                reader.readAsDataURL(input.files[0]);
            }
        };

        // Initial event listener
        input.addEventListener('change', handleFileChange);

        // Store original placeholder text
        const placeholderSpan = container.querySelector('span');
        if (placeholderSpan) {
            container.dataset.placeholder = placeholderSpan.textContent;
        }

        // Trigger file input click when container is clicked
        container.addEventListener('click', () => {
            input.click();
        });
    }
});


// --- Existing Custom Checkbox/Radio/Etc. Functionality (Keep As Is) ---
// Add null checks for robustness if elements might not always exist

// Custom checkbox functionality
document.querySelectorAll('.custom-checkbox input').forEach(checkbox => {
    const updateCheckboxStyle = () => {
        const container = checkbox.closest('.custom-checkbox');
        if (!container) return;
        const textDiv = container.querySelector('div:not(.checkmark)'); // Find the text container div
        if (textDiv) {
            const fontMedium = textDiv.querySelector('.font-medium');
            if (fontMedium) {
                if (checkbox.checked) {
                    fontMedium.classList.add('text-primary');
                    fontMedium.classList.remove('text-gray-700', 'dark:text-gray-300'); // Adjust dark theme class as needed
                } else {
                    fontMedium.classList.remove('text-primary');
                    // Add appropriate default text color class based on theme
                    fontMedium.classList.add(isDarkTheme ? 'dark:text-gray-300' : 'text-gray-700');
                }
            }
        }
    };
    checkbox.addEventListener('change', updateCheckboxStyle);
    updateCheckboxStyle(); // Initial style application
});


// Custom radio functionality
document.querySelectorAll('.custom-radio input').forEach(radio => {
    const updateRadioStyles = () => {
        document.querySelectorAll(`input[name="${radio.name}"]`).forEach(r => {
            const container = r.nextElementSibling; // Assumes label content is the next sibling
            if (container && container.classList.contains('flex')) { // Check if it's the expected container
                const textSpan = container.querySelector('span');
                const iconContainer = container.querySelector('div > i')?.parentElement; // Find icon container
                const radioMark = container.querySelector('.radiomark'); // <<<--- ADD THIS LINE to find the radiomark

                if (r.checked) {
                    container.classList.add('border-primary');
                    container.classList.remove('border-gray-300');
                    if (textSpan) {
                        textSpan.classList.add('text-primary');
                        textSpan.classList.remove('text-gray-700', 'text-gray-600', 'dark:text-gray-300');
                    }
                    if (iconContainer) {
                        iconContainer.classList.add('text-primary');
                        iconContainer.classList.remove('text-gray-600', 'dark:text-gray-400');
                    }
                    if (radioMark) { // <<<--- ADD THIS BLOCK
                        radioMark.classList.add('radiomark-checked'); // Add our new class
                    }
                } else {
                    container.classList.remove('border-primary');
                    container.classList.add('border-gray-300');
                    if (textSpan) {
                        textSpan.classList.remove('text-primary');
                        textSpan.classList.add(isDarkTheme ? 'dark:text-gray-300' : 'text-gray-700'); // Adjust dark theme
                    }
                    if (iconContainer) {
                        iconContainer.classList.remove('text-primary');
                        iconContainer.classList.add(isDarkTheme ? 'dark:text-gray-400' : 'text-gray-600'); // Adjust dark theme
                    }
                    if (radioMark) { // <<<--- ADD THIS BLOCK
                        radioMark.classList.remove('radiomark-checked'); // Remove our new class
                    }
                }
            }
        });
    };
    radio.addEventListener('change', updateRadioStyles);
    if (radio.checked) {
        updateRadioStyles(); // Initialize styles for the initially checked radio
    }
});

// Toggle switch functionality (if any specific logic is needed)
document.querySelectorAll('.toggle-switch input').forEach(toggle => {
    toggle.addEventListener('change', function () {
        // Logic for toggle switch change
    });
});

// Range slider functionality (if any specific logic is needed)
document.querySelectorAll('.custom-range').forEach(range => {
    range.addEventListener('input', function () {
        // Logic for range slider input
    });
});


// ==================================================================
// === NEW LEAFLET MAP INTEGRATION ================================
// ==================================================================

let leafletMap = null; // Make map variable accessible in broader scope if needed (e.g., for invalidateSize)
let leafletMarker = null;
let lastGeocodeQuery = ''; // To prevent redundant geocoding

function setupLeafletMap() {
    // --- Check if Leaflet library is loaded ---
    if (typeof L === 'undefined') {
        console.error("Leaflet library not loaded. Map functionality disabled.");
        return;
    }

    // --- Get DOM Elements specific to the location tab (using assumed IDs) ---
    const mapContainer = document.getElementById('map');
    const useLocationBtn = document.getElementById('use-location-btn');
    const searchAddressBtn = document.getElementById('search-address-btn');
    const streetAddressInput = document.getElementById('street-address');
    const cityInput = document.getElementById('city');
    const landmarkInput = document.getElementById('landmark');
    const geocodeErrorElement = document.getElementById('map-geocode-error'); // Error display element

    // --- Exit if essential elements aren't found ---
    if (!mapContainer || !useLocationBtn || !searchAddressBtn || !streetAddressInput || !cityInput || !landmarkInput || !geocodeErrorElement) {
        console.error("One or more required map elements not found in the DOM. Map functionality disabled. Ensure you have added the required IDs to your HTML.");
        return;
    }

    // --- Leaflet Map Initialization ---
    const defaultCoords = [26.9124, 75.7873]; // Default to Jaipur
    const defaultZoom = 12;
    const foundZoom = 17; // Zoom level when location is found/selected

    try {
        leafletMap = L.map(mapContainer, {
            scrollWheelZoom: true // Allow scroll wheel zoom
        }).setView(defaultCoords, defaultZoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(leafletMap);

        // Add marker (initially hidden or at default location)
        leafletMarker = L.marker(defaultCoords, {
            draggable: true,
            autoPan: true // Pan map when dragging marker near edges
        }).addTo(leafletMap);
        leafletMarker.setOpacity(0); // Hide marker initially

    } catch (error) {
        console.error("Leaflet map initialization failed:", error);
        showGeocodeError("Could not load the map interface.");
        // Disable buttons if map fails
        useLocationBtn.disabled = true;
        searchAddressBtn.disabled = true;
        return; // Stop further map setup
    }

    // --- Helper Functions (adapted for current DOM) ---
    function clearGeocodeError() {
        geocodeErrorElement.style.display = 'none';
        geocodeErrorElement.textContent = '';
    }

    function showGeocodeError(message) {
        console.error("Map/Geocoding Error:", message);
        geocodeErrorElement.textContent = message;
        geocodeErrorElement.style.display = 'block';
    }

    function updateMapPosition(lat, lng, zoomLevel = foundZoom) {
        if (!leafletMap || !leafletMarker) return;
        const newLatLng = L.latLng(lat, lng);
        leafletMarker.setLatLng(newLatLng);
        leafletMarker.setOpacity(1); // Make marker visible
        leafletMap.setView(newLatLng, zoomLevel);
        leafletMap.invalidateSize(); // Ensure map resizes correctly if container size changed
    }

    // --- Reverse Geocode (Coords -> Address) ---
    function reverseGeocodeAndUpdateFields(lat, lng) {
        updateMapPosition(lat, lng); // Update map first
        clearGeocodeError();

        // Optionally clear fields or wait for result
        streetAddressInput.value = 'Fetching address...';
        cityInput.value = '';
        // landmarkInput.value = ''; // Decide if you want to clear landmark

        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`;
        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log("Reverse Geocode Response:", data);
                if (data && data.address) {
                    const addr = data.address;
                    // Improved address construction
                    let street = [addr.road, addr.house_number].filter(Boolean).join(' ') ||
                        addr.pedestrian || addr.footway || addr.path ||
                        addr.suburb || addr.neighbourhood || ''; // Use suburb/neighbourhood as fallback street
                    let displayCity = addr.city || addr.town || addr.village || addr.county || ''; // Get city/town/village

                    // If street is still empty, use a less specific location part
                    if (!street && addr.municipality) street = addr.municipality;
                    else if (!street && data.display_name) street = data.display_name.split(',')[0]; // Fallback

                    streetAddressInput.value = street;
                    cityInput.value = displayCity;
                    landmarkInput.value = addr.amenity || addr.shop || addr.tourism || addr.historic || addr.building || ''; // Add building as potential landmark

                    clearGeocodeError();
                } else {
                    streetAddressInput.value = ''; // Clear if no address found
                    cityInput.value = '';
                    throw new Error("Could not find detailed address for this location.");
                }
            })
            .catch(error => {
                showGeocodeError("Could not fetch address details. Please check the location or enter manually.");
                // Clear fetching message on error
                if (streetAddressInput.value === 'Fetching address...') streetAddressInput.value = '';
            });
    }

    // --- Forward Geocode (Address -> Coords) ---
    function geocodeAddressAndUpdateMap() {
        const street = streetAddressInput.value.trim();
        const city = cityInput.value.trim();

        if (!street || !city) return; // Need street and city

        const query = `${street}, ${city}`;
        if (query === lastGeocodeQuery) return; // Avoid duplicate requests
        lastGeocodeQuery = query;

        clearGeocodeError();
        console.log(`Forward geocoding: ${query}`);
        // Add visual feedback? e.g., disable search button
        searchAddressBtn.disabled = true;
        searchAddressBtn.querySelector('span') ? searchAddressBtn.querySelector('span').textContent = 'Searching...' : searchAddressBtn.textContent = 'Searching...';


        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=1&countrycodes=in`; // Limit search to India

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log("Forward Geocode Response:", data);
                if (data && data.length > 0) {
                    const result = data[0];
                    const lat = parseFloat(result.lat);
                    const lon = parseFloat(result.lon);

                    if (!isNaN(lat) && !isNaN(lon)) {
                        updateMapPosition(lat, lon);
                    } else {
                        throw new Error("Invalid coordinates received.");
                    }
                } else {
                    throw new Error(`Could not find coordinates for "${query}". Please refine the address or use the map.`);
                }
            })
            .catch(error => {
                showGeocodeError(error.message || "Failed to find address. Please check spelling or use the map.");
                lastGeocodeQuery = ''; // Allow trying again if it failed
            })
            .finally(() => {
                // Restore search button
                searchAddressBtn.disabled = false;
                const searchIconHTML = '<div class="w-5 h-5 flex items-center justify-center"><i class="ri-search-line"></i></div> Search Address'; // Restore original button content
                searchAddressBtn.innerHTML = searchIconHTML;
            });
    }


    // --- Event Listeners for Map Interaction ---
    leafletMap.on('click', function (e) {
        reverseGeocodeAndUpdateFields(e.latlng.lat, e.latlng.lng);
    });

    leafletMarker.on('dragend', function (event) {
        const position = leafletMarker.getLatLng();
        reverseGeocodeAndUpdateFields(position.lat, position.lng);
    });


    // --- Event Listener for "Use My Location" Button ---
    useLocationBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
            showGeocodeError("Geolocation is not supported by your browser.");
            return;
        }

        clearGeocodeError();
        // Provide visual feedback - Disable and set text BEFORE calling API
        useLocationBtn.disabled = true;
        // Store the original HTML to restore later
        const originalButtonHTML = useLocationBtn.innerHTML;
        // Find the text part to change, careful not to overwrite icon
        const textElement = useLocationBtn.querySelector('span') || useLocationBtn; // Fallback to button itself if no span
        if (textElement) textElement.textContent = 'Locating...'; // Change only text part if possible


        // Define the reset function here to avoid repetition
        const resetButtonState = () => {
            useLocationBtn.disabled = false;
            useLocationBtn.innerHTML = originalButtonHTML; // Restore original HTML including icon
        };

        navigator.geolocation.getCurrentPosition(
            // Success Callback
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                console.log(`Location found: Lat: ${lat}, Lng: ${lng}, Accuracy: ${position.coords.accuracy}m`);
                // Call the function to update map and fields
                reverseGeocodeAndUpdateFields(lat, lng);
                // Reset button state AFTER successful processing starts (reverseGeocode is async)
                resetButtonState(); // <<<<< MOVE RESET HERE
            },
            // Error Callback
            (error) => {
                console.error("Geolocation error:", error);
                let message = "Could not get location. ";
                switch (error.code) {
                    case error.PERMISSION_DENIED: message += "Please allow location access in browser settings."; break;
                    case error.POSITION_UNAVAILABLE: message += "Location information unavailable."; break;
                    case error.TIMEOUT: message += "Request timed out."; break;
                    default: message += "Unknown error."; break;
                }
                showGeocodeError(message);
                // Reset button state AFTER handling the error
                resetButtonState(); // <<<<< MOVE RESET HERE
            },
            // Options
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
        // REMOVE the .finally() block as it's not standard here
        /*
        .finally(() => {
            // This block is removed
        });
        */
    });

    // --- Event Listeners for Address Input Fields (Blur) ---
    streetAddressInput.addEventListener('blur', geocodeAddressAndUpdateMap);
    cityInput.addEventListener('blur', geocodeAddressAndUpdateMap);


    // --- Event Listener for "Search Address" Button ---
    searchAddressBtn.addEventListener('click', () => {
        geocodeAddressAndUpdateMap(); // Explicitly trigger geocode
    });

    // --- Map Invalidation on Tab Switch (Handled in switchTab function) ---
    // We need to ensure the map size is correct when its container becomes visible.

    console.log("Leaflet map setup complete.");

} // End setupLeafletMap


// --- Initialize Map When DOM is Ready ---
// Use DOMContentLoaded to ensure all elements including the map container are ready
document.addEventListener('DOMContentLoaded', () => {
    // Call theme initialization again if needed, or ensure it runs after body is loaded
    // initializeTheme();

    // Setup the map specifically
    setupLeafletMap();

    // Any other initializations that depend on the DOM
});

// ==================================================================
// === END LEAFLET MAP INTEGRATION =================================
// ==================================================================