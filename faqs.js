(function() {
    'use strict';

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
                    var toggle = faq.querySelector('.faq-toggle');
                    if (toggle) toggle.textContent = '+';
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

    function extractSpreadsheetId(url) {
        // Handle various Google Sheets URL formats
        // Format 1: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/...
        // Format 2: https://docs.google.com/spreadsheets/d/e/PUBLISHED_ID/pub...
        var match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
        if (match) return match[1];

        // Try to extract from /d/e/ format (published)
        match = url.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/);
        if (match) return match[1];

        return null;
    }

    function loadFAQs() {
        var sheetUrl = SITE_CONFIG.dataSources && SITE_CONFIG.dataSources.faqsSheetUrl;

        if (!sheetUrl) {
            showError('FAQ data source not configured. Please add the Google Sheet URL to config.js');
            return;
        }

        var spreadsheetId = extractSpreadsheetId(sheetUrl);
        if (!spreadsheetId) {
            showError('Invalid Google Sheets URL format');
            return;
        }

        // Use Google Visualization API with JSONP callback
        var callbackName = 'faqCallback_' + Date.now();
        var gvizUrl = 'https://docs.google.com/spreadsheets/d/' + spreadsheetId + '/gviz/tq?tqx=responseHandler:' + callbackName;

        // Create callback function
        window[callbackName] = function(response) {
            // Clean up
            delete window[callbackName];
            var script = document.getElementById('faq-script');
            if (script) script.remove();

            if (response.status === 'error') {
                console.error('Google Sheets error:', response.errors);
                showError('Unable to load FAQ data from the spreadsheet');
                return;
            }

            var table = response.table;
            if (!table || !table.rows || table.rows.length === 0) {
                showError('No FAQ data found in the spreadsheet');
                return;
            }

            var faqs = [];
            for (var i = 0; i < table.rows.length; i++) {
                var row = table.rows[i];
                var question = row.c[0] && row.c[0].v ? row.c[0].v : '';
                var answer = row.c[1] && row.c[1].v ? row.c[1].v : '';

                if (question && answer) {
                    faqs.push({
                        question: question,
                        answer: answer
                    });
                }
            }

            if (faqs.length === 0) {
                showError('No valid FAQ entries found');
                return;
            }

            renderFAQs(faqs);
        };

        // Load script (JSONP style)
        var script = document.createElement('script');
        script.id = 'faq-script';
        script.src = gvizUrl;
        script.onerror = function() {
            delete window[callbackName];
            showError('Unable to connect to Google Sheets. Please check the URL and sharing settings.');
        };
        document.head.appendChild(script);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadFAQs);
    } else {
        loadFAQs();
    }
})();
