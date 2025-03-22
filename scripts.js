document.addEventListener('DOMContentLoaded', function () {
    const responseForm = document.getElementById('responseForm');
    const responsesTableBody = document.getElementById('responsesTable')?.querySelector('tbody');

    // Load existing responses from localStorage
    const responses = JSON.parse(localStorage.getItem('responses')) || [];

    if (responseForm) {
        responseForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = new FormData(responseForm);
            const newResponse = {
                name: formData.get('name'),
                email: formData.get('email'),
                content: formData.get('content'),
                status: 'Pending'
            };
            responses.push(newResponse);
            localStorage.setItem('responses', JSON.stringify(responses));
            alert('Response submitted!');
            responseForm.reset();
        });
    }

    if (responsesTableBody) {
        function renderResponses() {
            responsesTableBody.innerHTML = '';
            responses.forEach((response, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${response.name}</td>
                    <td>${response.email}</td>
                    <td>${response.content}</td>
                    <td>
                        <select data-index="${index}" class="status-select">
                            <option value="Added" ${response.status === 'Added' ? 'selected' : ''}>Added</option>
                            <option value="Noted" ${response.status === 'Noted' ? 'selected' : ''}>Noted</option>
                            <option value="Rejected" ${response.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                            <option value="In Progress" ${response.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                            <option value="Custom" ${response.status === 'Custom' ? 'selected' : ''}>Custom</option>
                        </select>
                        ${response.status === 'Custom' ? `<input type="text" data-index="${index}" class="custom-status" value="${response.customStatus || ''}">` : ''}
                    </td>
                    <td><button data-index="${index}" class="email-button">Send Email</button></td>
                `;
                responsesTableBody.appendChild(row);
            });

            document.querySelectorAll('.status-select').forEach(select => {
                select.addEventListener('change', function () {
                    const index = this.getAttribute('data-index');
                    responses[index].status = this.value;
                    if (this.value === 'Custom') {
                        responses[index].customStatus = '';
                    }
                    localStorage.setItem('responses', JSON.stringify(responses));
                    renderResponses();
                });
            });

            document.querySelectorAll('.custom-status').forEach(input => {
                input.addEventListener('input', function () {
                    const index = this.getAttribute('data-index');
                    responses[index].customStatus = this.value;
                    localStorage.setItem('responses', JSON.stringify(responses));
                });
            });

            document.querySelectorAll('.email-button').forEach(button => {
                button.addEventListener('click', function () {
                    const index = this.getAttribute('data-index');
                    const response = responses[index];
                    const emailContent = `Status: ${response.status === 'Custom' ? response.customStatus : response.status}`;
                    sendEmail(response.email, 'Your Response Status', emailContent);
                    alert('Email sent!');
                });
            });
        }

        function sendEmail(to, subject, body) {
            // Simulate sending email
            console.log(`Email sent to ${to}: ${subject} - ${body}`);
        }

        renderResponses();
    }

    // Add dark mode toggle functionality
    const darkModeToggle = document.getElementById('toggle-dark-mode');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }
});
