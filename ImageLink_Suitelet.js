/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/search', 'N/ui/serverWidget'], function(search, serverWidget) {

    function onRequest(context) {
        if (context.request.method === 'GET') {
            // Create the Suitelet form
            var form = serverWidget.createForm({
                title: 'Sales Order Images'
            });

            // Custom HTML field to display the images in an HTML table
            var htmlField = form.addField({
                id: 'custpage_htmlfield',
                type: serverWidget.FieldType.INLINEHTML,
                label: ' '
            });

            // Retrieve saved search results
            var savedSearch = search.load({ id: '3126' }); // Replace with your saved search ID
            var resultSet = savedSearch.run();
            var results = resultSet.getRange({
                start: 0,
                end: 100 // Adjust this as needed
            });

            // Generate HTML content for displaying images in a table
            var html = '<style>table { width: 100%; border-collapse: collapse; }' +
                       'table, th, td { border: 1px solid black; padding: 8px; text-align: left; }' +
                       'img { width: 50px; height: 50px; vertical-align: middle; margin-right: 10px; }</style>';
            html += '<table>';
            html += '<tr><th>Internal ID</th><th>Document Number</th><th>Thumbnail</th><th>Image Link</th></tr>';

            results.forEach(function(result) {
                var internalId = result.getValue({ name: 'internalid' });
                var documentNumber = result.getValue({ name: 'tranid' });
                var imageLink = result.getValue({ name: 'custcol_hcb_image_link' }); // Replace with your image link field ID

                // Add each row with internal ID, document number, thumbnail, and image link
                html += '<tr>';
                html += '<td>' + internalId + '</td>';
                html += '<td>' + documentNumber + '</td>';
                
                // Display image thumbnail
                if (imageLink) {
                    html += '<td><img src="' + imageLink + '" alt="Image Thumbnail" /></td>';
                } else {
                    html += '<td>No Image</td>';
                }
                
                // Display the image link as a clickable link
                html += '<td><a href="' + imageLink + '" target="_blank">' + imageLink + '</a></td>';
                html += '</tr>';
            });

            html += '</table>';

            // Set the HTML content to the custom field
            htmlField.defaultValue = html;

            // Display the form
            context.response.writePage(form);
        }
    }

    return {
        onRequest: onRequest
    };
});
