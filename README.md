<p align="center">
    <a href="http://www.imac-project.eu/">
        <img height="300px" width="774px" src="./img/LOGO-IMAC.png" />
    </a>
    <p align="center">
    	Follow the ImAc proyect in [Twitter](https://twitter.com/ImAcProject) and [YouTube](https://www.youtube.com/channel/UCfxyfFgC97BCv_hmiGVfe1Ar)
    </p>

</p>


<p>
	The goal of Immersive Accessibility (ImAc), which has been funded by the EU in the frame of the H2020 programme, is to explore how accessibility services can be integrated with immersive media. It is not acceptable that accessibility is regarded as an afterthought: rather it should be considered throughout the design, production and delivery process. ImAc will explore new deployment methods for these services (Subtitles, Audio Description, Audio Subtitling, Sign Language) in immersive environments. We will move away from the constraints of the current technology, into a Hyper-Personalized environment where the consumer can fully customize the experience to meet his personal needs. For example, it may be more appropriate for subtitles to be read out-loud or the Audio Description presented as text. The key action in ImAc will be to ensure immersive experiences are inclusive across different languages, addressing the needs of those with hearing and low vision problems, learning difficulties and the aged. We also foresee these services consumed by a wider audience, for personal convenience, learning language and language therapy – accessible content can add significant value to these related areas.
</p>


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

<ul>
    <li> Apache Tomcat (or any other web server)</li>
    <li> Git </li>
</ul>


### Installing

How to use run the ImAc player in Apache Tomcat:

* Run C:\apache-tomcat\bin\startup.bat
* Open C:\apache-tomcat\webapps folder
* Copy imac_player folder into webapps folder
* Open a browser and type: "your_apache_server_address"/imac_player/


## Built With

* [IMSC_360.js](https://github.com/sandflow/imscJS) - JavaScript library for rendering IMSC Text and Image Profile documents in HTML5
* [three.js](https://threejs.org/)
* [DASH.js](https://github.com/Dash-Industry-Forum/dash.js/wiki) - Reference client implementation for the playback of DASH contents via JavaScript and compliant browsers.
* [Omnitone.js](https://github.com/GoogleChrome/omnitone) - Implementation of Ambisonic decoding and binaural rendering written in Web Audio Application Program Interface


## Documentation

This deliverable describes the architectural aspects, components and features of the ImAc player, focused on its current version for single screen scenarios and presentation of immersive contents, subtitles and sign language videos. The different pieces of software that make up the player, together with the necessary steps to make it running, are also explained. Finally, the deliverable explains the different screens, User Interfaces, menus and controls available in the player for the interactive and personalized presentation of contents. This first iteration of the player has been targeted for its use in the first pilot phase.

[D3.5](http://imac-project.eu/wp-content/uploads/2018/12/D3.5-Player-.pdf)



## Acknowledgments

This project has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement [No 761974](https://cordis.europa.eu/project/rcn/211084/factsheet/en).