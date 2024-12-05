document.addEventListener('DOMContentLoaded', function() {
    // Get the buttons
    const rtoBtn = document.getElementById('rtoBtn');
    const mukhiyaBtn = document.getElementById('mukhiyaBtn');
    const advocateBtn = document.getElementById('advocateBtn');
    const policeBtn = document.getElementById('policeBtn');
    const truckBtn = document.getElementById('truckBtn');
    const vahanSuvidhaBtn = document.getElementById('vahanSuvidhaBtn');
    const sarathiBtn = document.getElementById('sarathiBtn');
    const fastagButton = document.getElementById('fastag-button');
    const starlinkBtn = document.getElementById('starlinkBtn'); // New StarLink button
    const locationBtn = document.getElementById('locationBtn'); // New Detect My Location button



    // Get the sections
    const fastagSection = document.getElementById('fastagSection');
    const vahanForms = document.getElementById('vahanForms');
    const sarathiSections = document.getElementById('sarathiSections');
    const advocateDataSection = document.getElementById('advocateDataSection');
    const policeDataSection = document.getElementById('policeDataSection');
    const truckDataSection = document.getElementById('truckDataSection');
    const rtoDataSection = document.getElementById('rtoDataSection');
    const starlinkSection = document.getElementById('starlinkSection'); // New StarLink section
    const locationSection = document.getElementById('locationSection'); // New Location section


    

    // Add click event listeners to the buttons
    rtoBtn.addEventListener('click', function() {
        fetch('rto.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').map(row => row.split(','));
                const headers = rows[0];
                const tableBody = document.querySelector('#rtoDataTable tbody');
                const tableHead = document.querySelector('#rtoDataTable thead tr');

                // Clear existing table content
                tableHead.innerHTML = '';
                tableBody.innerHTML = '';

                // Populate table headers
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header.trim();
                    tableHead.appendChild(th);
                });

                // Populate table rows
                rows.slice(1).forEach(row => {
                    const tr = document.createElement('tr');
                    row.forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell.trim();
                        tr.appendChild(td);
                    });
                    tableBody.appendChild(tr);
                });

                // Show the RTO data section
                rtoDataSection.style.display = 'block';
                fastagSection.style.display = 'none';
                vahanForms.style.display = 'none';
                sarathiSections.style.display = 'none';
                advocateDataSection.style.display = 'none';
                policeDataSection.style.display = 'none';
                truckDataSection.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching CSV:', error);
                alert('Failed to load RTO data.');
            });
    });

    mukhiyaBtn.addEventListener('click', function() {
        alert('Contacting local Mukhiya...');
    });

    advocateBtn.addEventListener('click', function() {
        fetch('advocate_data.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').map(row => row.split(','));
                const headers = rows[0];
                const tableBody = document.querySelector('#advocateDataTable tbody');
                const tableHead = document.querySelector('#advocateDataTable thead tr');

                // Clear existing table content
                tableHead.innerHTML = '';
                tableBody.innerHTML = '';

                // Populate table headers
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header.trim();
                    tableHead.appendChild(th);
                });

                // Populate table rows
                rows.slice(1).forEach(row => {
                    const tr = document.createElement('tr');
                    row.forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell.trim();
                        tr.appendChild(td);
                    });
                    tableBody.appendChild(tr);
                });

                // Show the Advocate data section
                advocateDataSection.style.display = 'block';
                fastagSection.style.display = 'none';
                vahanForms.style.display = 'none';
                sarathiSections.style.display = 'none';
                policeDataSection.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching CSV:', error);
                alert('Failed to load Advocate data.');
            });
    });

    policeBtn.addEventListener('click', function() {
        fetch('police_data.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').map(row => row.split(','));
                const headers = rows[0];
                const tableBody = document.querySelector('#policeDataTable tbody');
                const tableHead = document.querySelector('#policeDataTable thead tr');

                // Clear existing table content
                tableHead.innerHTML = '';
                tableBody.innerHTML = '';

                // Populate table headers
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header.trim();
                    tableHead.appendChild(th);
                });

                // Populate table rows
                rows.slice(1).forEach(row => {
                    const tr = document.createElement('tr');
                    row.forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell.trim();
                        tr.appendChild(td);
                    });
                    tableBody.appendChild(tr);
                });

                // Show the Police data section
                policeDataSection.style.display = 'block';
                fastagSection.style.display = 'none';
                vahanForms.style.display = 'none';
                sarathiSections.style.display = 'none';
                advocateDataSection.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching CSV:', error);
                alert('Failed to load Police data.');
            });
    });

    truckBtn.addEventListener('click', function() {
        fetch('truck_data.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').map(row => row.split(','));
                const headers = rows[0];
                const tableBody = document.querySelector('#truckDataTable tbody');
                const tableHead = document.querySelector('#truckDataTable thead tr');

                // Clear existing table content
                tableHead.innerHTML = '';
                tableBody.innerHTML = '';

                // Populate table headers
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.textContent = header.trim();
                    tableHead.appendChild(th);
                });

                // Populate table rows
                rows.slice(1).forEach(row => {
                    const tr = document.createElement('tr');
                    row.forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell.trim();
                        tr.appendChild(td);
                    });
                    tableBody.appendChild(tr);
                });

                // Show the Truck Associations data section
                truckDataSection.style.display = 'block';
                fastagSection.style.display = 'none';
                vahanForms.style.display = 'none';
                sarathiSections.style.display = 'none';
                advocateDataSection.style.display = 'none';
                policeDataSection.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching CSV:', error);
                alert('Failed to load Truck Associations data.');
            });
    });

    vahanSuvidhaBtn.addEventListener('click', function() {
        vahanForms.style.display = vahanForms.style.display === 'none' || vahanForms.style.display === '' ? 'block' : 'none';
        fastagSection.style.display = 'none';
        sarathiSections.style.display = 'none';
        advocateDataSection.style.display = 'none';
        policeDataSection.style.display = 'none';
    });

    sarathiBtn.addEventListener('click', function() {
        sarathiSections.style.display = sarathiSections.style.display === 'none' || sarathiSections.style.display === '' ? 'block' : 'none';
        fastagSection.style.display = 'none';
        vahanForms.style.display = 'none';
        advocateDataSection.style.display = 'none';
        policeDataSection.style.display = 'none';
    });

    fastagButton.addEventListener('click', function() {
        fastagSection.style.display = fastagSection.style.display === 'none' || fastagSection.style.display === '' ? 'block' : 'none';
        vahanForms.style.display = 'none';
        sarathiSections.style.display = 'none';
        advocateDataSection.style.display = 'none';
        policeDataSection.style.display = 'none';
    });
    starlinkBtn.addEventListener('click', function() {
        starlinkSection.style.display = starlinkSection.style.display === 'none' || starlinkSection.style.display === '' ? 'block' : 'none';
        fastagSection.style.display = 'none';
        vahanForms.style.display = 'none';
        sarathiSections.style.display = 'none';
        advocateDataSection.style.display = 'none';
        policeDataSection.style.display = 'none';
        truckDataSection.style.display = 'none';
        rtoDataSection.style.display = 'none';
    });
    locationBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            document.getElementById('locationInfo').textContent = "Geolocation is not supported by this browser.";
        }
    });
    function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        document.getElementById('locationInfo').textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;
        locationSection.style.display = 'block';
        fastagSection.style.display = 'none';
        vahanForms.style.display = 'none';
        sarathiSections.style.display = 'none';
        advocateDataSection.style.display = 'none';
        policeDataSection.style.display = 'none';
        truckDataSection.style.display = 'none';
        rtoDataSection.style.display = 'none';
        starlinkSection.style.display = 'none';
    }

    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                document.getElementById('locationInfo').textContent = "User denied the request for Geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                document.getElementById('locationInfo').textContent = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                document.getElementById('locationInfo').textContent = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                document.getElementById('locationInfo').textContent = "An unknown error occurred.";
                break;
        }
    }


    // Optional: Add event listeners to the forms to handle submissions
    document.getElementById('fuel-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Fuel payment submitted!');
        // You can add more logic here to handle the form submission
    });

    document.getElementById('challan-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('E-Challan payment submitted!');
        // You can add more logic here to handle the form submission
    });

    document.getElementById('insurance-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Insurance verification submitted!');
        // You can add more logic here to handle the form submission
    });

    document.getElementById('finance-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Ownership check submitted!');
        // You can add more logic here to handle the form submission
    });

    document.getElementById('rental-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Rental document upload submitted!');
        // You can add more logic here to handle the form submission
    });

    document.getElementById('ecommerce-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('E-commerce listing verification submitted!');
        // You can add more logic here to handle the form submission
    });

    document.getElementById('law-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Vehicle investigation request submitted!');
        // You can add more logic here to handle the form submission
    });

    document.getElementById('dealer-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Vehicle registration submitted!');
        // You can add more logic here to handle the form submission
    });

    document.getElementById('permitForm').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Vehicle permit renewal submitted!');
        // You can add more logic here to handle the form submission
    });

    document.getElementById('paymentForm').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Payment made successfully!');
        // You can add more logic here to handle the form submission
    });
    document.getElementById('starlink-form').addEventListener('submit', function(event) {
        event.preventDefault();
        alert('StarLink subscription submitted!');
        // You can add more logic here to handle the form submission
    });
});