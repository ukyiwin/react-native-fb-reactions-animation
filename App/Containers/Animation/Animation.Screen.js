import React, { Component } from 'react'
import { Animated, BackHandler, Image, PanResponder, Text, TouchableOpacity, View } from 'react-native'

import styles from './Animation.Style'
import images from '../../Themes/Images'
import FastImage from 'react-native-fast-image'

export default class AnimationScreen extends Component {
  constructor (props) {
    super(props)
    this.backPress = this.handleBackPress.bind(this)

    // Slow down speed animation here (1 = default)
    this.timeDilation = 1

    // If duration touch longer than it, mean long touch
    this.durationLongPress = 250

    // Variables to check
    // 0 = nothing, 1 = like, 2 = love, 3 = haha, 4 = wow, 5 = sad, 6 = angry
    this.isTouchBtn = false

    this.isLongTouch = false
    this.isLiked = false
    this.whichIconUserChoose = 0
    this.currentIconFocus = 0
    this.previousIconFocus = 0
    this.isDragging = false
    this.isDraggingOutside = false
    this.isJustDragInside = true

    // Duration animation
    this.durationAnimationBox = 500
    this.durationAnimationQuickTouch = 500
    this.durationAnimationLongTouch = 150
    this.durationAnimationIconWhenDrag = 150

    // ------------------------------------------------------------------------------
    // Animation button when quick touch button
    this.tiltIconAnim = new Animated.Value(0)
    this.zoomIconAnim = new Animated.Value(0)
    this.zoomTextAnim = new Animated.Value(0)

    // ------------------------------------------------------------------------------
    // Animation when button long touch button
    this.tiltIconAnim2 = new Animated.Value(0)
    this.zoomIconAnim2 = new Animated.Value(0)
    this.zoomTextAnim2 = new Animated.Value(0)
    // Animation of the box
    this.fadeBoxAnim = new Animated.Value(0)

    // Animation for icons
    this.moveRightGroupIcon = new Animated.Value(10)
    // Like
    this.pushIconLikeUp = new Animated.Value(0)
    this.zoomIconLike = new Animated.Value(0.01)
    // Love
    this.pushIconLoveUp = new Animated.Value(0)
    this.zoomIconLove = new Animated.Value(0.01)
    // Haha
    this.pushIconHahaUp = new Animated.Value(0)
    this.zoomIconHaha = new Animated.Value(0.01)
    // Wow
    this.pushIconWowUp = new Animated.Value(0)
    this.zoomIconWow = new Animated.Value(0.01)
    // Sad
    this.pushIconSadUp = new Animated.Value(0)
    this.zoomIconSad = new Animated.Value(0.01)
    // Angry
    this.pushIconAngryUp = new Animated.Value(0)
    this.zoomIconAngry = new Animated.Value(0.01)

    // ------------------------------------------------------------------------------
    // Animation for zoom icons when drag
    this.zoomIconChosen = new Animated.Value(1)
    this.zoomIconNotChosen = new Animated.Value(1)
    this.zoomIconWhenDragOutside = new Animated.Value(1)
    this.zoomIconWhenDragInside = new Animated.Value(1)
    this.zoomBoxWhenDragInside = new Animated.Value(1)
    this.zoomBoxWhenDragOutside = new Animated.Value(0.95)

    // ------------------------------------------------------------------------------
    // For jump icon when release
    this.zoomIconWhenRelease = new Animated.Value(1)
    this.moveUpIconWhenRelease = new Animated.Value(1)
    this.moveLeftIconLikeWhenRelease = new Animated.Value(1)
    this.moveLeftIconLoveWhenRelease = new Animated.Value(1)
    this.moveLeftIconHahaWhenRelease = new Animated.Value(1)
    this.moveLeftIconWowWhenRelease = new Animated.Value(1)
    this.moveLeftIconSadWhenRelease = new Animated.Value(1)
    this.moveLeftIconAngryWhenRelease = new Animated.Value(1)
  }

  componentWillMount () {
    BackHandler.addEventListener('hardwareBackPress', this.backPress)

    this.setupPanResponder()
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.backPress)
  }

  handleBackPress () {
    this.props.navigation.goBack()
    return true
  }

  setupPanResponder () {
    this.rootPanResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => !this.isTouchBtn,

      onPanResponderGrant: (evt, gestureState) => {
        // console.log('on grant')
      },

      onPanResponderMove: (evt, gestureState) => {
        // console.log('on move', gestureState)

        // return if the drag is drag without touch button
        if (!this.isLongTouch) return

        // the margin top the box is 100
        // and plus the height of toolbar and the status bar
        // so the range we check is about 150 -> 450
        if (gestureState.y0 + gestureState.dy >= 150 && gestureState.y0 + gestureState.dy <= 450) {

          this.isDragging = true
          this.isDraggingOutside = false

          if (this.isJustDragInside) {
            this.controlIconWhenDragInside()
          }

          if (gestureState.x0 + gestureState.dx >= 35 && gestureState.x0 + gestureState.dx < 88.33) {
            console.log('like')
            if (this.currentIconFocus !== 1) {
              this.handleWhenDragBetweenIcon(1)
            }
          } else if (gestureState.x0 + gestureState.dx >= 88.33 && gestureState.x0 + gestureState.dx < 141.66) {
            console.log('love')
            if (this.currentIconFocus !== 2) {
              this.handleWhenDragBetweenIcon(2)
            }
          } else if (gestureState.x0 + gestureState.dx >= 141.66 && gestureState.x0 + gestureState.dx < 194.99) {
            console.log('haha')
            if (this.currentIconFocus !== 3) {
              this.handleWhenDragBetweenIcon(3)
            }
          } else if (gestureState.x0 + gestureState.dx >= 194.99 && gestureState.x0 + gestureState.dx < 248.32) {
            console.log('wow')
            if (this.currentIconFocus !== 4) {
              this.handleWhenDragBetweenIcon(4)
            }
          } else if (gestureState.x0 + gestureState.dx >= 248.32 && gestureState.x0 + gestureState.dx < 301.65) {
            console.log('sad')
            if (this.currentIconFocus !== 5) {
              this.handleWhenDragBetweenIcon(5)
            }
          } else if (gestureState.x0 + gestureState.dx >= 301.65 && gestureState.x0 + gestureState.dx <= 354.98) {
            console.log('angry')
            if (this.currentIconFocus !== 6) {
              this.handleWhenDragBetweenIcon(6)
            }
          }
        } else {
          // console.log('outside')

          this.whichIconUserChoose = 0
          this.previousIconFocus = 0
          this.currentIconFocus = 0
          this.isJustDragInside = true

          if (this.isDragging && !this.isDraggingOutside) {
            this.isDragging = false
            this.isDraggingOutside = true
            this.setState({})

            this.controlBoxWhenDragOutside()
            this.controlIconWhenDragOutside()
          }
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        // console.log('on release')

        this.isDragging = false
        this.isDraggingOutside = false
        this.isJustDragInside = true
        this.previousIconFocus = 0
        this.currentIconFocus = 0
        this.setState({})

        this.onDragRelease()
      }
    })
  }

  onTouchStart = () => {
    // console.log('touch start')
    this.isTouchBtn = true
    this.setState({})

    this.timerMeasureLongTouch = setTimeout(this.doAnimationLongTouch, this.durationLongPress)
  }

  onTouchEnd = () => {
    // console.log('touch end')
    this.isTouchBtn = false
    this.setState({})

    if (!this.isLongTouch) {
      clearTimeout(this.timerMeasureLongTouch)
      this.doAnimationQuickTouch()
    }
  }

  onDragRelease = () => {
    this.doAnimationLongTouchReverse()
  }

  // ------------------------------------------------------------------------------
  // Animation button when quick touch button
  doAnimationQuickTouch = () => {
    if (!this.isLiked) {

      this.isLiked = true
      this.setState({})

      this.tiltIconAnim.setValue(0)
      this.zoomIconAnim.setValue(0)
      this.zoomTextAnim.setValue(0)
      Animated.parallel([
        Animated.timing(this.tiltIconAnim, {
          toValue: 1,
          duration: this.durationAnimationQuickTouch * this.timeDilation
        }),
        Animated.timing(this.zoomIconAnim, {
          toValue: 1,
          duration: this.durationAnimationQuickTouch * this.timeDilation
        }),
        Animated.timing(this.zoomTextAnim, {
          toValue: 1,
          duration: this.durationAnimationQuickTouch * this.timeDilation
        })
      ]).start()
    } else {
      this.isLiked = false
      this.setState({})

      this.tiltIconAnim.setValue(1)
      this.zoomIconAnim.setValue(1)
      this.zoomTextAnim.setValue(1)
      Animated.parallel([
        Animated.timing(this.tiltIconAnim, {
          toValue: 0,
          duration: this.durationAnimationQuickTouch * this.timeDilation
        }),
        Animated.timing(this.zoomIconAnim, {
          toValue: 0,
          duration: this.durationAnimationQuickTouch * this.timeDilation
        }),
        Animated.timing(this.zoomTextAnim, {
          toValue: 0,
          duration: this.durationAnimationQuickTouch * this.timeDilation
        })
      ]).start()
    }
  }

  // ------------------------------------------------------------------------------
  // Animation when button long touch button
  doAnimationLongTouch = () => {

    this.isLongTouch = true
    this.setState({})

    this.tiltIconAnim2.setValue(0)
    this.zoomIconAnim2.setValue(1)
    this.zoomTextAnim2.setValue(1)

    this.fadeBoxAnim.setValue(0)

    this.moveRightGroupIcon.setValue(10)

    this.pushIconLikeUp.setValue(0)
    this.zoomIconLike.setValue(0.01)

    this.pushIconLoveUp.setValue(0)
    this.zoomIconLove.setValue(0.01)

    this.pushIconHahaUp.setValue(0)
    this.zoomIconHaha.setValue(0.01)

    this.pushIconWowUp.setValue(0)
    this.zoomIconWow.setValue(0.01)

    this.pushIconSadUp.setValue(0)
    this.zoomIconSad.setValue(0.01)

    this.pushIconAngryUp.setValue(0)
    this.zoomIconAngry.setValue(0.01)

    Animated.parallel([
      // Button
      Animated.timing(this.tiltIconAnim2, {
        toValue: 1,
        duration: this.durationAnimationLongTouch * this.timeDilation
      }),
      Animated.timing(this.zoomIconAnim2, {
        toValue: 0.8,
        duration: this.durationAnimationLongTouch * this.timeDilation
      }),
      Animated.timing(this.zoomTextAnim2, {
        toValue: 0.8,
        duration: this.durationAnimationLongTouch * this.timeDilation
      }),

      // Box
      Animated.timing(this.fadeBoxAnim, {
        toValue: 1,
        duration: this.durationAnimationBox * this.timeDilation,
        delay: 350
      }),

      // Group icon
      Animated.timing(this.moveRightGroupIcon, {
        toValue: 20,
        duration: this.durationAnimationBox * this.timeDilation
      }),

      Animated.timing(this.pushIconLikeUp, {
        toValue: 25,
        duration: 250 * this.timeDilation
      }),
      Animated.timing(this.zoomIconLike, {
        toValue: 1,
        duration: 250 * this.timeDilation
      }),

      Animated.timing(this.pushIconLoveUp, {
        toValue: 25,
        duration: 250 * this.timeDilation,
        delay: 50
      }),
      Animated.timing(this.zoomIconLove, {
        toValue: 1,
        duration: 250 * this.timeDilation,
        delay: 50
      }),

      Animated.timing(this.pushIconHahaUp, {
        toValue: 25,
        duration: 250 * this.timeDilation,
        delay: 100
      }),
      Animated.timing(this.zoomIconHaha, {
        toValue: 1,
        duration: 250 * this.timeDilation,
        delay: 100
      }),

      Animated.timing(this.pushIconWowUp, {
        toValue: 25,
        duration: 250 * this.timeDilation,
        delay: 150
      }),
      Animated.timing(this.zoomIconWow, {
        toValue: 1,
        duration: 250 * this.timeDilation,
        delay: 150
      }),

      Animated.timing(this.pushIconSadUp, {
        toValue: 25,
        duration: 250 * this.timeDilation,
        delay: 200
      }),
      Animated.timing(this.zoomIconSad, {
        toValue: 1,
        duration: 250 * this.timeDilation,
        delay: 200
      }),

      Animated.timing(this.pushIconAngryUp, {
        toValue: 25,
        duration: 250 * this.timeDilation,
        delay: 250
      }),
      Animated.timing(this.zoomIconAngry, {
        toValue: 1,
        duration: 250 * this.timeDilation,
        delay: 250
      })
    ]).start()
  }

  doAnimationLongTouchReverse = () => {
    this.tiltIconAnim2.setValue(1)
    this.zoomIconAnim2.setValue(0.8)
    this.zoomTextAnim2.setValue(0.8)

    this.fadeBoxAnim.setValue(1)

    this.moveRightGroupIcon.setValue(20)

    this.pushIconLikeUp.setValue(25)
    this.zoomIconLike.setValue(1)

    this.pushIconLoveUp.setValue(25)
    this.zoomIconLove.setValue(1)

    this.pushIconHahaUp.setValue(25)
    this.zoomIconHaha.setValue(1)

    this.pushIconWowUp.setValue(25)
    this.zoomIconWow.setValue(1)

    this.pushIconSadUp.setValue(25)
    this.zoomIconSad.setValue(1)

    this.pushIconAngryUp.setValue(25)
    this.zoomIconAngry.setValue(1)

    Animated.parallel([
      // Button
      Animated.timing(this.tiltIconAnim2, {
        toValue: 0,
        duration: this.durationAnimationLongTouch * this.timeDilation
      }),
      Animated.timing(this.zoomIconAnim2, {
        toValue: 1,
        duration: this.durationAnimationLongTouch * this.timeDilation
      }),
      Animated.timing(this.zoomTextAnim2, {
        toValue: 1,
        duration: this.durationAnimationLongTouch * this.timeDilation
      }),

      // Box
      Animated.timing(this.fadeBoxAnim, {
        toValue: 0,
        duration: this.durationAnimationLongTouch * this.timeDilation
      }),

      // Group icon
      Animated.timing(this.moveRightGroupIcon, {
        toValue: 10,
        duration: this.durationAnimationBox * this.timeDilation
      }),

      Animated.timing(this.pushIconLikeUp, {
        toValue: 0,
        duration: 250 * this.timeDilation
      }),
      Animated.timing(this.zoomIconLike, {
        toValue: 0.01,
        duration: 250 * this.timeDilation
      }),

      Animated.timing(this.pushIconLoveUp, {
        toValue: 0,
        duration: 250 * this.timeDilation,
        delay: 50
      }),
      Animated.timing(this.zoomIconLove, {
        toValue: 0.01,
        duration: 250 * this.timeDilation,
        delay: 50
      }),

      Animated.timing(this.pushIconHahaUp, {
        toValue: 0,
        duration: 250 * this.timeDilation,
        delay: 100
      }),
      Animated.timing(this.zoomIconHaha, {
        toValue: 0.01,
        duration: 250 * this.timeDilation,
        delay: 100
      }),

      Animated.timing(this.pushIconWowUp, {
        toValue: 0,
        duration: 250 * this.timeDilation,
        delay: 150
      }),
      Animated.timing(this.zoomIconWow, {
        toValue: 0.01,
        duration: 250 * this.timeDilation,
        delay: 150
      }),

      Animated.timing(this.pushIconSadUp, {
        toValue: 0,
        duration: 250 * this.timeDilation,
        delay: 200
      }),
      Animated.timing(this.zoomIconSad, {
        toValue: 0.01,
        duration: 250 * this.timeDilation,
        delay: 200
      }),

      Animated.timing(this.pushIconAngryUp, {
        toValue: 0,
        duration: 250 * this.timeDilation,
        delay: 250
      }),
      Animated.timing(this.zoomIconAngry, {
        toValue: 0.01,
        duration: 250 * this.timeDilation,
        delay: 250
      })
    ]).start(this.onAnimationLongTouchComplete)
  }

  onAnimationLongTouchComplete = () => {
    this.isLongTouch = false
    this.setState({})
  }

  // ------------------------------------------------------------------------------
  // Animation for zoom icons when drag
  handleWhenDragBetweenIcon = (currentIcon) => {
    this.whichIconUserChoose = currentIcon
    this.previousIconFocus = this.currentIconFocus
    this.currentIconFocus = currentIcon

    this.controlIconWhenDrag()
  }

  controlIconWhenDrag = () => {
    this.zoomIconChosen.setValue(0.8)
    this.zoomIconNotChosen.setValue(1.8)
    this.zoomBoxWhenDragInside.setValue(1.0)

    // For update logic at render function
    this.setState({})

    // Need timeout so logic check at render function can update
    setTimeout(() => Animated.parallel([
      Animated.timing(this.zoomIconChosen, {
        toValue: 1.8,
        duration: this.durationAnimationIconWhenDrag * this.timeDilation,
      }),
      Animated.timing(this.zoomIconNotChosen, {
        toValue: 0.8,
        duration: this.durationAnimationIconWhenDrag * this.timeDilation
      }),
      Animated.timing(this.zoomBoxWhenDragInside, {
        toValue: 0.95,
        duration: this.durationAnimationIconWhenDrag * this.timeDilation
      })
    ]).start(), 50)
  }

  controlIconWhenDragInside = () => {
    this.setState({})

    this.zoomIconWhenDragInside.setValue(1.0)
    Animated.timing(this.zoomIconWhenDragInside, {
      toValue: 0.8,
      duration: this.durationAnimationIconWhenDrag * this.timeDilation
    }).start(this.onAnimationIconWhenDragInsideComplete)
  }

  onAnimationIconWhenDragInsideComplete = () => {
    this.isJustDragInside = false
    this.setState({})
  }

  controlIconWhenDragOutside = () => {
    this.zoomIconWhenDragOutside.setValue(0.8)

    Animated.timing(this.zoomIconWhenDragOutside, {
      toValue: 1.0,
      duration: this.durationAnimationIconWhenDrag * this.timeDilation
    }).start()
  }

  controlBoxWhenDragOutside = () => {
    this.zoomBoxWhenDragOutside.setValue(0.95)

    Animated.timing(this.zoomBoxWhenDragOutside, {
      toValue: 1.0,
      duration: this.durationAnimationIconWhenDrag * this.timeDilation
    }).start()
  }

  render () {
    let tiltBounceIconAnim = this.tiltIconAnim.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: ['0deg', '20deg', '-15deg', '0deg']
    })
    let zoomBounceIconAnim = this.zoomIconAnim.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [1, 0.8, 1.15, 1]
    })
    let zoomBounceTextAnim = this.zoomIconAnim.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [1, 0.8, 1.15, 1]
    })

    let tiltBounceIconAnim2 = this.tiltIconAnim2.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '20deg']
    })

    return (
      <View style={styles.viewContainer}>
        {/* Toolbar */}
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={() => this.handleBackPress()}>
            <Image style={styles.icBack} source={images.ic_back}/>
          </TouchableOpacity>
          <Text style={styles.titleToolbar}>ANIMATION</Text>
          <View style={styles.icTrail}/>
        </View>

        {/* Body */}
        <View style={styles.viewBody} {...this.rootPanResponder.panHandlers} >
          {/* Top space */}
          <View style={styles.viewTopSpace}/>

          {/* Content */}
          <View style={styles.viewContent}>

            {/* Box */}
            <Animated.View style={[styles.viewBox, {
              opacity: this.fadeBoxAnim,
              transform: [{
                scale: this.isDragging ?
                  (this.previousIconFocus === 0 ? this.zoomBoxWhenDragInside : 0.95) :
                  this.isDraggingOutside ? this.zoomBoxWhenDragOutside : 1.0
              }]
            }]}/>

            {/* Group icon */}
            {this.renderGroupIcon()}

            {/*Group icon for jump*/}
            {this.renderGroupJumpIcon()}

            {/* Button */}
            <View style={styles.viewBtn} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}>
              <Animated.Image source={this.isLiked ? images.like_static_fill : images.like_static}
                              style={[styles.imgLikeInBtn,
                                {
                                  transform: [
                                    {rotate: this.isLongTouch ? tiltBounceIconAnim2 : tiltBounceIconAnim},
                                    {scale: this.isLongTouch ? this.zoomIconAnim2 : zoomBounceIconAnim}]
                                }]}/>
              <Animated.Text
                style={[styles.textBtn, {color: this.isLiked ? '#3b5998' : 'grey'},
                  {transform: [{scale: this.isLongTouch ? this.zoomTextAnim2 : zoomBounceTextAnim}]}]}>
                Like
              </Animated.Text>
            </View>
          </View>

        </View>
      </View>
    )
  }

  renderGroupIcon () {
    return (
      <Animated.View style={[styles.viewWrapGroupIcon, {marginLeft: this.moveRightGroupIcon}]}>

        {/* Icon like */}
        <Animated.View style={{
          marginBottom: this.pushIconLikeUp, transform: [{
            scale: this.isDragging ?
              (this.currentIconFocus === 1 ?
                this.zoomIconChosen :
                (this.previousIconFocus === 1 ?
                  this.zoomIconNotChosen :
                  this.isJustDragInside ? this.zoomIconWhenDragInside : 0.8)) :
              this.isDraggingOutside ? this.zoomIconWhenDragOutside : this.zoomIconLike
          }],
        }}>
          <FastImage
            style={styles.imgIcon}
            source={{uri: 'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/App/Images/like.gif'}}/>
        </Animated.View>

        {/* Icon love */}
        <Animated.View style={{
          marginBottom: this.pushIconLoveUp, transform: [{
            scale: this.isDragging ?
              (this.currentIconFocus === 2 ?
                this.zoomIconChosen :
                (this.previousIconFocus === 2 ?
                  this.zoomIconNotChosen :
                  this.isJustDragInside ? this.zoomIconWhenDragInside : 0.8)) :
              this.isDraggingOutside ? this.zoomIconWhenDragOutside : this.zoomIconLove
          }]
        }}>
          <FastImage
            style={styles.imgIcon}
            source={{uri: 'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/App/Images/love.gif'}}/>
        </Animated.View>

        {/* Icon haha */}
        <Animated.View style={{
          marginBottom: this.pushIconHahaUp, transform: [{
            scale: this.isDragging ?
              (this.currentIconFocus === 3 ?
                this.zoomIconChosen :
                (this.previousIconFocus === 3 ?
                  this.zoomIconNotChosen :
                  this.isJustDragInside ? this.zoomIconWhenDragInside : 0.8)) :
              this.isDraggingOutside ? this.zoomIconWhenDragOutside : this.zoomIconHaha
          }]
        }}>
          <FastImage
            style={styles.imgIcon}
            source={{uri: 'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/App/Images/haha.gif'}}/>
        </Animated.View>

        {/* Icon wow */}
        <Animated.View style={{
          marginBottom: this.pushIconWowUp, transform: [{
            scale: this.isDragging ?
              (this.currentIconFocus === 4 ?
                this.zoomIconChosen :
                (this.previousIconFocus === 4 ?
                  this.zoomIconNotChosen :
                  this.isJustDragInside ? this.zoomIconWhenDragInside : 0.8)) :
              this.isDraggingOutside ? this.zoomIconWhenDragOutside : this.zoomIconWow
          }]
        }}>
          <FastImage
            style={styles.imgIcon}
            source={{uri: 'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/App/Images/wow.gif'}}/>
        </Animated.View>

        {/* Icon sad */}
        <Animated.View style={{
          marginBottom: this.pushIconSadUp, transform: [{
            scale: this.isDragging ?
              (this.currentIconFocus === 5 ?
                this.zoomIconChosen :
                (this.previousIconFocus === 5 ?
                  this.zoomIconNotChosen :
                  this.isJustDragInside ? this.zoomIconWhenDragInside : 0.8)) :
              this.isDraggingOutside ? this.zoomIconWhenDragOutside : this.zoomIconSad
          }]
        }}>
          <FastImage
            style={styles.imgIcon}
            source={{uri: 'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/App/Images/sad.gif'}}/>
        </Animated.View>

        {/* Icon angry */}
        <Animated.View style={{
          marginBottom: this.pushIconAngryUp, transform: [{
            scale: this.isDragging ?
              (this.currentIconFocus === 6 ?
                this.zoomIconChosen :
                (this.previousIconFocus === 6 ?
                  this.zoomIconNotChosen :
                  this.isJustDragInside ? this.zoomIconWhenDragInside : 0.8)) :
              this.isDraggingOutside ? this.zoomIconWhenDragOutside : this.zoomIconAngry
          }]
        }}>
          <FastImage
            style={styles.imgIcon}
            source={{uri: 'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/App/Images/angry.gif'}}/>
        </Animated.View>

      </Animated.View>
    )
  }

  renderGroupJumpIcon () {
    return (
      <View style={styles.viewWrapGroupJumpIcon}>
        <Animated.View style={{marginLeft: 20}}>
          <FastImage
            style={styles.imgIcon}
            source={{uri: 'https://raw.githubusercontent.com/duytq94/facebook-reaction-animation2/master/App/Images/like.gif'}}/>
        </Animated.View>
      </View>
    )
  }
}
