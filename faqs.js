(function() {
    'use strict';

    function parseCSV(csvText) {
        var lines = [];
        var currentLine = [];
        var currentField = '';
        var inQuotes = false;

        for (var i = 0; i < csvText.length; i++) {
            var char = csvText[i];
            var nextChar = csvText[i + 1];

            if (inQuotes) {
                if (char === '"' && nextChar === '"') {
                    currentField += '"';
                    i++;
                } else if (char === '"') {
                    inQuotes = false;
                } else {
                    currentField += char;
                }
            } else {
                if (char === '"') {
                    inQuotes = true;
                } else if (char === ',') {
                    currentLine.push(currentField.trim());
                    currentField = '';
                } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
                    currentLine.push(currentField.trim());
                    if (currentLine.length > 0 && currentLine.some(function(f) { return f !== ''; })) {
                        lines.push(currentLine);
                    }
                    currentLine = [];
                    currentField = '';
                    if (char === '\r') i++;
                } else if (char !== '\r') {
                    currentField += char;
                }
            }
        }

        if (currentField || currentLine.length > 0) {
            currentLine.push(currentField.trim());
            if (currentLine.some(function(f) { return f !== ''; })) {
                lines.push(currentLine);
            }
        }

        return lines;
    }

    function renderFAQs(faqs) {
        var container = document.getElementById('faq-container');
        if (!container) return;

        container.innerHTML = '';

        faqs.forEach(function(faq) {
            var item = document.createElement('div');
            item.className = 'faq-item';

            var button = document.createElement('button');
            button.className = 'faq-question';
            button.innerHTML = '<span>' + escapeHtml(faq.question) + '</span><span class="faq-toggle">+</span>';

            var answer = document.createElement('div');
            answer.className = 'faq-answer';
            answer.innerHTML = '<p>' + escapeHtml(faq.answer) + '</p>';

            item.appendChild(button);
            item.appendChild(answer);
            container.appendChild(item);
        });

        initFAQToggle();
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function initFAQToggle() {
        var questions = document.querySelectorAll('.faq-question');
        questions.forEach(function(question) {
            question.addEventListener('click', function() {
                var item = this.parentElement;
                var isOpen = item.classList.contains('active');

                document.querySelectorAll('.faq-item').forEach(function(faq) {
                    faq.classList.remove('active');
                    faq.querySelector('.faq-toggle').textContent = '+';
                });

                if (!isOpen) {
                    item.classList.add('active');
                    this.querySelector('.faq-toggle').textContent = '−';
                }
            });
        });
    }

    function showError(message) {
        var container = document.getElementById('faq-container');
        if (container) {
            container.innerHTML = '<p class="faq-error">' + escapeHtml(message) + '</p>';
        }
    }

    function loadFAQs() {
        var sheetUrl = SITE_CONFIG.dataSources && SITE_CONFIG.dataSources.faqsSheetUrl;

        if (!sheetUrl) {
            showError('FAQ data source not configured. Please add the Google Sheet URL to config.js');
            return;
        }

        fetch(sheetUrl)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Failed to fetch FAQ data');
                }
                return response.text();
            })
            .then(function(csvText) {
                var rows = parseCSV(csvText);

                if (rows.length < 2) {
                    showError('No FAQ data found in the spreadsheet');
                    return;
                }

                var faqs = [];
                for (var i = 1; i < rows.length; i++) {
                    var row = rows[i];
                    if (row[0] && row[1]) {
                        faqs.push({
                            question: row[0],
                            answer: row[1]
                        });
                    }
                }

                if (faqs.length === 0) {
                    showError('No valid FAQ entries found');
                    return;
                }

                renderFAQs(faqs);
            })
            .catch(function(error) {
                console.error('Error loading FAQs:', error);
                showError('Unable to load FAQs. Please try again later.');
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFAQs);
    } else {
        loadFAQs();
    }
})();
