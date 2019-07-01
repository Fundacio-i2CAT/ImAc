# Release 0.8.0

Date 27/06/2019

## Changelog

	* Add: Change SL size
	* Add: Holy land 4 description
	* Add: New covers
	* Add: Only access languages with available languages are shown
	* Add: New banner images
	* Add: Save config into the player menu
	* Add: remote bootstrap libs
	* Add: Google Analytics
    * Add: unique id per device
	* Modify: Acces options are disabled when language is not available
	* Modify: Open links in a new tap
	* Modify: New MainMenuController that includes the old playpause volume settings and access controllers
	* Modify: New MainMenuModel that includes the old playpause volume settings and access models
	* Modify: Added videoProgressBarController to MainMenuController
	* Fix: Issue with SL arrows
	* Fix: Error in presentation title
	* Fix: Presentation AD/AST listing when available
	* Fix: Bug when active access option was unavailable and then available again could not be clicked.
	* Fix: German translation
	* Fix: Preview auto play when video was already pasued fixed
	* Fix: When subtitles are disabled signer goes back to bottom
	* Fix: Issue with search check box
	* Fix: Issues with voice control
	* Fix: Issues with data variable in mainmenucontroller
	* Fix: Options menu title not hidden on start
	* Fix: uuid issue


### Known Bugs/Issues

	* Flickering in the subtitles when move the head in Oculus Go and Samsung VR devices
	* When small menu open subtitles and signer elements are behind


# Release 0.7.0

Date 9/05/2019

## Changelog

	* Add: New portal interface
	* Add: Search functionality in portal interface
	* Add: Translate functionality in portal interface
	* Add: Configuration menu in portal interface
	* Add: Voice control functionalities
	* Add: Buttons to enable or dissable the access. services (ST , SL , AD, AST) in the main menu player interface
	* Add: Representation mode in AST services
	* Add: Disable access options when language not available
	* Add: Change SL size option
	* Add: Links to the parthners webpages and ImAc social networks 	
	* Modify: Player menu interface
	* Modify: Configuration menu structure
	* Modify: content.json adding duration, acces, description, poster and language parameters
	* Modify: Access language, now there is only one language selector for all services
	* Modify: Indicator, now there is the same for ST and SL
	* Modify: Safe area, now there is the same for ST and SL
	* Fix: Latitude subtitles position that is printed inverted
	* Fix: Issue with SL arrows indicator
	* Fix: Vocabulary issues

### Known Bugs/Issues

	* Flickering in the subtitles when move the head in Oculus Go and Samsung VR devices
	* When small menu open subtitles and signer elements are behind


	
	
	
# Release 0.5.0

Date 28/11/2018

## Changelog

	* Add: AD functionalities (language, presentation mode, volume)
	* Add: AST functionalities (language, easy to read, volume)
	* Add: new KPI to the QoE logger
	* Add: support to new MPD with subtitles AdaptationSet
	* Add: support to new MPD with signer AdaptationSet
	* Add: support to new MPD with AD AdaptationSet
	* Add: support to new MPD with AST AdaptationSet
	* Add: support to multiple period in the MPD
	* Add: preview function
	* Add: close multioptions menu when click outside	
	* Modify: The SL Top/Bottom position options has been modified for Right/Left position options
	* Modify: In HMD the menu is opened in front of the user
	* Modify: positioning signer top when subtitles go top
	* Fix: error when the JSON file have an empty signer value
	* Fix: autoplay of the signer video when the Enhanced-Accessibility menu is opened
	* Fix: default options of SL not highlighted in yellow
	* Fix: values for signer area
	* Fix: issues with the oculus rift controller

### Known Bugs/Issues

	* Flickering in the subtitles when move the head in Oculus Go and Samsung VR devices
	* Auto-positioning functionality does not let you open the menu again
	* When small menu open subtitles and signer elements are behind


