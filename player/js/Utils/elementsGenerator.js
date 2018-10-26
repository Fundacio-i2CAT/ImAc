//************************************************************************************
// HTML generators
//************************************************************************************


function createListGroup(i, imagePath, dataName) 
{
	$("#list_group")
	.append(
		$('<div class="img-container-4">')
		.attr('id','content'+i)
		.append(
			$('<img>')
			.attr('id', i)
			.attr('src', imagePath)
			.attr('alt', 'ImAc')
			.attr('onclick', 'selectXML(this.id)')
			.append('</img>')
		)
		.append(
            $('<p>')
            .append(dataName)
            .append('</p>')
		)
		.append('</div>')
	)
}
