// responsiveSubs.js
function responsiveSubs(c) {
	this.contents = c;
	this.subContent = null;

}
var RSerrorHandler = {
        info: function (msg) {
            console.log("info: " + msg);
            return false;
        },
        warn: function (msg) {
            console.log("warn: " + msg);
            return false;
        },
        error: function (msg) {
            console.log("error: " + msg);
            return false;
        },
        fatal: function (msg) {
            console.log("fatal: " + msg);
            return false;
        }
    };
    
function toHHMMSS(s) {
	var sec_num = s; // don't forget the second param
	var hours = Math.floor(sec_num / 3600);
	var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	var seconds = sec_num - (hours * 3600) - (minutes * 60);
	seconds = Math.round(seconds * 100) / 100;

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	return hours + ':' + minutes + ':' + seconds;
}

function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function longestWord(string) {
	var str = string.split(" ");
	var longest = 0;
	var word = null;
	for (var i = 0; i < str.length; i++) {
		if (longest < str[i].length) {
			longest = str[i].length;
			word = str[i];
		}
	}
	return word.length;
}

function splitter(str, l) {
	var strs = [];
	while (str.length > l) {
		var pos = str.substring(0, l).lastIndexOf(' ');
		pos = pos <= 0 ? l : pos;
		strs.push(str.substring(0, pos));
		var i = str.indexOf(' ', pos) + 1;
		if (i < pos || i > pos + l)
			i = pos;
		str = str.substring(i);
	}
	strs.push(str);
	return strs;
}


responsiveSubs.prototype = {
	constructor: responsiveSubs,

	/*
	IMSCtoWords: This takes a TT-object and converts it to an array of words
	for each word we store the style information that existed with the original subtitle 
	and interpolate the time for each word
	*/
	IMSCtoWords: function() {

		this.subContent = this.contents.body.contents[0].contents;
		this.words = [];
		

		for (var index in this.subContent) {

			//Extract each subtitle from the TT Object
			var begin = this.subContent[index].begin;
			var end = this.subContent[index].end;
			var backgroundColor = [0,0,0,0];
			var color = [255, 255, 255, 0];
			var textAlign = "left";
			var fontSize = 110;
			var equirectangularLongitude = 0;
			var equirectangularLatitude = 0; //i2cat
			var text = "";
			
			for (var cindex in this.subContent[index].contents) {
				
				if (this.subContent[index].contents[cindex].styleAttrs) {
					if (this.subContent[index].equirectangularLongitude)
						equirectangularLongitude = this.subContent[index].equirectangularLongitude;
					if (this.subContent[index].equirectangularLatitude)
						equirectangularLatitude = this.subContent[index].equirectangularLatitude; //i2cat
					if (this.subContent[index].contents[cindex].contents)
						text = text + " " + this.subContent[index].contents[cindex].contents[0].text;
					if (this.subContent[index].contents[cindex].styleAttrs['http://www.w3.org/ns/ttml#styling color'])
						color = this.subContent[index].contents[cindex].styleAttrs['http://www.w3.org/ns/ttml#styling color'];
					if (this.subContent[index].contents[cindex].styleAttrs['http://www.w3.org/ns/ttml#styling backgroundColor'])
						backgroundColor = this.subContent[index].contents[cindex].styleAttrs['http://www.w3.org/ns/ttml#styling backgroundColor'];
					if (this.subContent[index].contents[cindex].styleAttrs['http://www.w3.org/ns/ttml#styling fontSize'])
						fontSize = this.subContent[index].contents[cindex].styleAttrs['http://www.w3.org/ns/ttml#styling fontSize'].value;
					if (this.subContent[index].styleAttrs['http://www.w3.org/ns/ttml#styling textAlign'])
						textAlign = this.subContent[index].styleAttrs['http://www.w3.org/ns/ttml#styling textAlign'];
				}
			}



			text = text.replace(/(\r\n|\n|\r|\t)/gm, ""); //Newlines
			text = text.replace(/ +(?= )/g, ""); //White Space
	
		
			//Split each line into words
			var words = text.split(" ");
			var subDur = end - begin;
			var wordDur = subDur / words.length;
			//console.log (words.length + " " + subDur + " " + wordDur);
//i2cat
			for (var index in words) {

				b = begin + (wordDur * index);
				e = begin + (wordDur * index) + wordDur;
				identifier = backgroundColor + color + textAlign + fontSize;
				if (words[index]) 
					this.words.push([identifier, words[index], b, e, [rgbToHex(backgroundColor[0], backgroundColor[1], backgroundColor[2]),rgbToHex(color[0], color[1], color[2]),textAlign, fontSize, equirectangularLongitude, equirectangularLatitude]]);
			}
		}
	},

	/*
	blockSubsBySpeaker: This takes the list of words and creates an array of phrases, by 
	combining the words until there is either a pause in time or change of speaker
	*/
	blockSubsBySpeaker: function(space=" ", max=30) {
		//Recombine the words by speaker
		var tempsubs = [];
		var newSub = "",
			speaker, text, start, end, container;
		var count = 1;

		for (var word = 0; word < this.words.length; word++) {
			speaker = this.words[word][0];
			style = this.words[word][4];
			text = this.words[word][1];

			if (word > 0) timeLapsed = this.words[word][2] - this.words[word - 1][3];
			else timeLapsed = 0;


			if (word > 0 && current_speaker == speaker && count < max - 1 && timeLapsed < 2) {
				newSub += text + space;
				end = this.words[word][3];
				count++;
			} else {
				if (word > 0) tempsubs.push([current_speaker, newSub.trim(), start, end, current_style]);
				end = this.words[word][3];
				current_speaker = speaker;
				current_style = style;
				start = this.words[word][2];
				newSub = text + space;
				count = 0;
			}
		}
		this.words = tempsubs;
		//console.log(this.words);
	},


	/*
	splitSubsByLPL: This takes the list of phrases and creates a list of new subtitles, 
	iteratively best fitting the words to evenly distribute the subtitles
	*/
	splitSubsByLPL: function(targetLPL) {
		blocksubs = [];
		//Lets work out the most captions needed to meed the lpl

		for (var phrase in this.words) {

			//work out the per word timing
			wordsInPhrase = this.words[phrase][1].split(" ").length;
			start = this.words[phrase][2];
			end = this.words[phrase][3];
			durationPerWord = (end - start) / wordsInPhrase;

			//find the longest word
			//console.log (this.words[phrase][1]);
			longest = longestWord(this.words[phrase][1]) + 1;


			//iteratively reduce the lpl until it increases the number of subtitles
			lpl = targetLPL;
			num_captions = splitter(this.words[phrase][1], lpl).length;
			while (splitter(this.words[phrase][1], lpl - 1).length == num_captions) lpl--;
			if (lpl < longest) lpl = longest;
			splitsubs = splitter(this.words[phrase][1], lpl);

			//calculate the time split
			s = parseFloat(this.words[phrase][2]);
			for (var i = 0; i < splitsubs.length; i++) {
				w = splitsubs[i].split(" ").length;
				e = w * durationPerWord;
				blocksubs.push([this.words[phrase][0], splitsubs[i].trim(), s, s + e, this.words[phrase][4]]);
				s = s + parseFloat(e);
			}

		}
		this.words = blocksubs;
	},

	/*
	toIMSC: This creates a new TTML representation of the array, and then uses it to bootstrap
	a new IMSC TT-Object
	*/
	toIMSC: function(fontSize="", fontFamily="", backgroundColor="", color="", textAlign="", lineHeight="") {
		var newContent = Object.assign({}, this.contents);
		var container = "";

		var colors = [];
		var styles = [];
		for (var phrase in this.words) {
			if (colors.indexOf(this.words[phrase][0]) === -1) {
				colors.push(this.words[phrase][0]);
				styles.push(this.words[phrase][4]);
			}
		}

var ttmlhead = `
<?xml version="1.0" encoding="UTF-8"?>
<tt:tt xmlns:tt="http://www.w3.org/ns/ttml" xmlns:ttp="http://www.w3.org/ns/ttml#parameter" xmlns:ttm="http://www.w3.org/ns/ttml#metadata" xmlns:tts="http://www.w3.org/ns/ttml#styling" xmlns:ittp="http://www.w3.org/ns/ttml/profile/imsc1#parameter" xmlns:imac="http://www.imac-project.eu" xmlns:imacY="http://www.imac-project.eu" ttp:timeBase="media" ttp:profile="http://www.w3.org/ns/ttml/profile/imsc1/text" ttp:cellResolution="`;
ttmlhead += this.contents.cellResolution['w'] + " " + this.contents.cellResolution['h'];
ttmlhead += `" xml:lang="esp">
	<tt:head>
		<tt:metadata/>
		<tt:styling>
`;
		for (var c in styles) {
			if (fontSize == "") myfontSize = styles[c][3]; else myfontSize = fontSize;
			if (fontFamily == "") myfontFamily = "Verdana, Arial, Tiresias"; else myfontFamily = fontFamily;
			if (backgroundColor == "") mybackgroundColor = styles[c][0]; else mybackgroundColor = backgroundColor;
			if (color == "") mycolor = styles[c][1]; else mycolor = color;
			if (textAlign == "") mytextAlign = styles[c][2]; else mytextAlign = textAlign;
			if (lineHeight == "") mylineHeight = 125; else mylineHeight = lineHeight;

			ttmlhead += "<tt:style tts:textAlign=\"" + mytextAlign + "\"  tts:fontSize=\"" + myfontSize + "%\" tts:fontFamily=\"" + myfontFamily + "\" tts:lineHeight=\"" + mylineHeight + "%\" tts:backgroundColor=\"" + mybackgroundColor + "\" tts:color=\"" + mycolor + "\" xml:id=\"S" + (parseInt(c) + 1) + "\"/>";
		}

ttmlhead += `
		</tt:styling>
		<tt:layout>
			<tt:region tts:displayAlign="after" tts:extent="80% 80%" tts:origin="10% 10%" xml:id="R1"/>
		</tt:layout>
	</tt:head>
	<tt:body>
		<tt:div>
`;

		for (var phrase in this.words) {
			var style = colors.indexOf(this.words[phrase][0]) + 1;
			//console.log(this.words[phrase][0] + style);
			ttmlsub = "<tt:p begin=\"" + toHHMMSS(this.words[phrase][2]) + "\" end=\"" + toHHMMSS(this.words[phrase][3]) + "\"";
			ttmlsub += " region=\"R1\" style=\"S" + style + "\" xml:id=\"C1\" imac:equirectangularLongitude=\"" + this.words[phrase][4][4] + "\" imac:equirectangularLatitude=\"" + this.words[phrase][4][5] + "\">"; //i2cat
			var eachSub = this.words[phrase][1].split("\n");
			for (var s in eachSub) {
				ttmlsub += "<tt:span style=\"S" + style + "\">" + eachSub[s] + "</tt:span><tt:br/>";
			}
			ttmlsub += "</tt:p>";
			ttmlhead += ttmlsub;
		}

ttmlhead += `
        </tt:div>
	</tt:body>
</tt:tt>
`;
		newImscDoc = imsc.fromXML(ttmlhead, RSerrorHandler);
		return newImscDoc;
	},


	/*
	getStyles: return an array of the different styles
	*/
	getStyles: function() {
		var colors = [];
		var styles = [];
		for (var phrase in this.words) {
			if (colors.indexOf(this.words[phrase][0]) === -1) {
				colors.push(this.words[phrase][0]);
				styles.push(this.words[phrase][4].concat([this.words[phrase][0]]));
			}
		}
		return styles;
	},
	
	/*
	getWords: return an array of the words
	*/
	getWords: function() {
		return this.words;
	}
	
	
};