//************************************************************************************
// HTML generators
//************************************************************************************

function createSubtittleDiv() 
{
	$("#container")
	.append(
		$('<div class="webvr-polyfill-fullscreen-wrapper">')
		.attr('id', 'main')
		.append(
			$('<div>')
			.attr('id', 'asd')
			.css('width', viewArea/2 + '%')
			.css('height', viewArea/2 + 'vw')
			//.css('border-style','ridge')
			//.css('border-color','#2581c4') 
			.css('margin-left', '-1%')
			.css('margin-top', '1%')
			.append('</div>')
		)
		.append(
			$('<div>')
			.attr('id', 'asd2')
			.css('width', viewArea/2 + '%')
			.css('height', viewArea/2 + 'vw')
			//.css('border-style','ridge')
			//.css('border-color','#2581c4') 
			.css('margin-right', '-1%')
			.css('margin-top', '1%')
			.append('</div>')
		)
		.append('</div>')
	)
}

function createSubtittleIndicatorDiv(imagePath1, imagePath2) 
{
	$("#container")
	.append(
		$('<div class="webvr-polyfill-fullscreen-wrapper">')
		.attr('id', 'main2')
		.append(
			$('<div>')
			.attr('id', 'asdd')
			.css('width', viewArea/2 + '%')
			.css('height', viewArea/8 + 'vw')
			//.css('border-style','ridge')
			//.css('border-color','#2581c4') 
			.css('margin-left', '-1%')
			.css('margin-top', viewArea/3 + '%')
			.append(
			$('<img class="subtitle-image left">')
				.attr('id', 'imageSub1-left')
				.attr('src', imagePath1)
				.append('</img>')
			)
			.append(
			$('<img class="subtitle-image">')
				.attr('id', 'imageSub1-right')
				.attr('src', imagePath2)
				.append('</img>')
			)
			.append('</div>')
		)
		.append(
			$('<div>')
			.attr('id', 'asdd2')
			.css('width', viewArea/2 + '%')
			.css('height', viewArea/8 + 'vw')
			//.css('border-style','ridge')
			//.css('border-color','#2581c4') 
			.css('margin-right', '-1%')
			.css('margin-top', viewArea/3 + '%')
			.append(
			$('<img class="subtitle-image left">')
				.attr('id', 'imageSub2-left')
				.attr('src', imagePath1)
				.append('</img>')
			)
			.append(
			$('<img class="subtitle-image">')
				.attr('id', 'imageSub2-right')
				.attr('src', imagePath2)
				.append('</img>')
			)
			.append('</div>')
		)
		.append('</div>')
	)
}

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
			.attr('onerror', 'this.src ="img/noContent.png"')
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


