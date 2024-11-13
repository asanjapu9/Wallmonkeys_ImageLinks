/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/search', 'N/ui/serverWidget', 'N/log'], function(search, serverWidget, log) {

    function onRequest(context) {
        var form = serverWidget.createForm({
            title: 'Wallmonkey Orders with Thumbnail'
        });

        // Add custom HTML field to style the page
        var styleField = form.addField({
            id: 'custpage_styles',
            type: serverWidget.FieldType.INLINEHTML,
            label: ' '
        });

        // CSS styling to improve the form layout
        styleField.defaultValue = '<style>' +
            '.ns-form-horizontal tr:nth-child(even) { background-color: #f9f9f9; }' +
            '.ns-form-horizontal tr:hover { background-color: #f1f1f1; }' +
            '.ns-form-horizontal th { background-color: #f2f2f2; padding: 8px; font-weight: bold; }' +
            '.ns-form-horizontal td { padding: 8px; text-align: center; }' +
            '.ns-inline-filter { display: flex; align-items: center; margin-bottom: 15px; }' +
            '.ns-inline-filter input[type="text"] { margin-right: 10px; padding: 5px; }' +
            '.ns-header { text-align: center; font-family: Arial, sans-serif; margin-top: 20px; font-size: 20px; }' +
            '</style>';

        // Add an HTML field for the page content
        var htmlField = form.addField({
            id: 'custpage_htmlfield',
            type: serverWidget.FieldType.INLINEHTML,
            label: ' '
        });

        // HTML for the header
        var html = '<h2 class="ns-header"></h2>' +
            '<table class="ns-form-horizontal" style="width: 100%; border-collapse: collapse;">' +
            '<tr><th>Document Number</th><th>Item</th><th>Quantity</th><th>Thumbnail</th><th>Image Link</th></tr>';

        if (context.request.method === 'GET') {
            // Load the saved search to retrieve data
            var savedSearch = search.load({ id: '3075' }); // Replace with your saved search ID

            // Fetch the saved search results
            var resultSet = savedSearch.run();
            var results = resultSet.getRange({
                start: 0,
                end: 100 // Adjust this as needed
            });

            // Generate table rows with the search results
            results.forEach(function(result) {
                var documentNumber = result.getValue({ name: 'tranid' });
                var item = result.getText({ name: 'item' }); // Access item as text to get item name
                var quantity = result.getValue({ name: 'quantity' }); // Access quantity as value
                var imageLink = result.getValue({ name: 'custcol_hcb_image_link' }); // Replace with your image link field ID

                html += '<tr>';
                html += '<td>' + (documentNumber || 'N/A') + '</td>';
                html += '<td>' + (item || 'N/A') + '</td>';
                html += '<td>' + (quantity || 'N/A') + '</td>';

                // Display larger image thumbnail if available
                if (imageLink) {
                    html += '<td><img src="' + imageLink + '" alt="Thumbnail Image" style="width:100px; height:100px;" /></td>';
                } else {
                    html += '<td>No Image</td>';
                }

                // Display the clickable image link
                html += '<td><a href="' + imageLink + '" target="_blank">' + imageLink + '</a></td>';
                html += '</tr>';
            });
        }

        html += '</table>';

        // Set the HTML content to the custom field
        htmlField.defaultValue = html;

        // Display the form
        context.response.writePage(form);
    }

    return {
        onRequest: onRequest
    };
});