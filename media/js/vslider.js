// eslint-disable-next-line no-shadow-restricted-names
(function($, undefined) {

    $.widget('mobile.verticalslider', $.mobile.widget, $.extend({
        widgetEventPrefix: 'verticalslide',

        options: {
            theme: null,
            trackTheme: null,
            disabled: false,
            initSelector: 'input[type="vrange"], :jqmData(type="vrange"), ' +
                ':jqmData(role="verticalslider")',
            mini: false,
            highlight: false
        },

        _create: function() {

            // TODO: Each of these should have comments explain what they're for
            var self = this;
            var control = this.element;
            var parentTheme = $.mobile.getInheritedTheme(control, 'c');
            var theme = this.options.theme || parentTheme;
            var trackTheme = this.options.trackTheme || parentTheme;
            var cType = control[ 0 ].nodeName.toLowerCase();
            var isRangeslider = control.parent()
                .is(':jqmData(role="vrangeslider")');
            var selectClass = (this.isToggleSwitch) ?
                'ui-slider-vertical-switch' : '';
            var controlID = control.attr('id');
            var $label = $('[for="' + controlID + '"]');
            var labelID = $label.attr('id') || controlID + '-label';
            var label = $label.attr('id', labelID);
            var min = !this.isToggleSwitch ?
                parseFloat(control.attr('min')) : 0;
            var max =  !this.isToggleSwitch ?
                parseFloat(control.attr('max')) :
                control.find('option').length - 1;
            var step = window.parseFloat(control.attr('step') || 1);
            var miniClass = (this.options.mini ||
                             control.jqmData('mini')) ? ' ui-mini' : '';
            var domHandle = document.createElement('a');
            var handle = $(domHandle);
            var domSlider = document.createElement('div');
            var slider = $(domSlider);
            var valuebg = this.options.highlight &&
                !this.isToggleSwitch ? (function() {
                    var bg = document.createElement('div');
                    bg.className = 'ui-slider-vertical-bg ' +
                        $.mobile.activeBtnClass;
                    return $(bg).prependTo(slider);
                })() : false;
            var options;
            var wrapper;

            domHandle.setAttribute('href', '#');
            domSlider.setAttribute('role', 'application');
            domSlider.className = [
                this.isToggleSwitch ? 'ui-slider-vertical ' :
                    'ui-slider-vertical-track ',
                selectClass, ' ui-btn-down-',
                trackTheme, ' ', miniClass].join('');
            domHandle.className = 'ui-slider-vertical-handle';
            jQuery(domHandle).prependTo(slider);

            if (this.options.highlight && !this.isToggleSwitch) {
                var elt = document.createElement('div');
                elt.className = 'ui-slider-vertical-fill';
                this.fillbg = $(elt).prependTo(slider);
            }

            handle.buttonMarkup({corners: true, theme: theme, shadow: true})
                .attr({
                    'role': 'verticalslider',
                    'aria-valuemin': min,
                    'aria-valuemax': max,
                    'aria-valuenow': this._value(),
                    'aria-valuetext': this._value(),
                    'title': this._value(),
                    'aria-labelledby': labelID
                });

            $.extend(this, {
                slider: slider,
                handle: handle,
                type: cType,
                step: step,
                max: max,
                min: min,
                valuebg: valuebg,
                isRangeslider: isRangeslider,
                dragging: false,
                beforeStart: null,
                userModified: false,
                mouseMoved: false
            });

            if (this.isToggleSwitch) {
                wrapper = document.createElement('div');
                wrapper.className = 'ui-slider-vertical-inneroffset';

                for (var j = 0, length = domSlider.childNodes.length;
                    j < length; j++) {
                    wrapper.appendChild(domSlider.childNodes[j]);
                }

                domSlider.appendChild(wrapper);

                // slider.wrapInner('<div class='ui-slider-inneroffset'></div>');

                // make the handle move with a smooth transition
                handle.addClass('ui-slider-vertical-handle-snapping');

                options = control.find('option');

                for (var i = 0, optionsCount = options.length;
                    i < optionsCount; i++) {
                    var side = !i ? 'b' : 'a';
                    var sliderTheme = !i ? ' ui-btn-down-' + trackTheme :
                        (' ' + $.mobile.activeBtnClass);
                    var sliderImg = document.createElement('span');

                    sliderImg.className = [
                        'ui-slider-vertical-label ui-slider-vertical-label-',
                        side, sliderTheme, ' '].join('');
                    sliderImg.setAttribute('role', 'img');
                    sliderImg
                        .appendChild(
                            document.createTextNode(options[i].innerHTML));
                    $(sliderImg).prependTo(slider);
                }

                self._labels = $('.ui-slider-vertical-label', slider);

            }

            label.addClass('ui-slider-vertical');

            // monitor the input for updated values
            control.addClass(this.isToggleSwitch ?
                'ui-slider-vertical-switch' :
                'ui-slider-vertical-input');

            this._on(control, {
                'change': '_controlChange',
                'keyup': '_controlKeyup',
                'blur': '_controlBlur',
                'vmouseup': '_controlVMouseUp'
            });

            slider.bind('vmousedown', $.proxy(this._sliderVMouseDown, this))
                .bind('vclick', false);

            // We have to instantiate a new function object for the unbind to work properly
            // since the method itself is defined in the prototype (causing it to unbind everything)
            this._on(document, {'vmousemove': '_preventDocumentDrag'});
            this._on(slider.add(document), {'vmouseup': '_sliderVMouseUp'});

            slider.insertAfter(control);

            // wrap in a div for styling purposes
            if (!this.isToggleSwitch && !isRangeslider) {
                wrapper = this.options.mini ?
                    '<div class="ui-slider-vertical ui-mini">' :
                    '<div class="ui-slider-vertical">';
                control.add(slider).wrapAll(wrapper);
            }

            // Only add focus class to toggle switch, sliders get it automatically from ui-btn
            if (this.isToggleSwitch) {
                this.handle.bind({
                    focus: function() {
                        slider.addClass($.mobile.focusClass);
                    },

                    blur: function() {
                        slider.removeClass($.mobile.focusClass);
                    }
                });
            }

            // bind the handle event callbacks and set the context to the widget instance
            this._on(this.handle, {
                'vmousedown': '_handleVMouseDown',
                'keydown': '_handleKeydown',
                'keyup': '_handleKeyup'
            });

            this.handle.bind('vclick', false);

            this._handleFormReset();

            this.refresh(undefined, undefined, true);
        },

        _controlChange: function(event) {
            // if the user dragged the handle, the 'change' event was triggered from inside refresh(); don't call refresh() again
            if (this._trigger('controlchange', event) === false) {
                return false;
            }
            if (!this.mouseMoved) {
                this.refresh(this._value(), true);
            }
        },

        _controlKeyup: function(event) { // necessary?
            this.refresh(this._value(), true, true);
        },

        _controlBlur: function(event) {
            this.refresh(this._value(), true);
        },

        // it appears the clicking the up and down buttons in chrome on
        // range/number inputs doesn't trigger a change until the field is
        // blurred. Here we check thif the value has changed and refresh
        _controlVMouseUp: function(event) {
            this._checkedRefresh();
        },

        // NOTE force focus on handle
        _handleVMouseDown: function(event) {
            this.handle.focus();
        },

        _handleKeydown: function(event) {
            var index = this._value();
            if (this.options.disabled) {
                return;
            }

            // In all cases prevent the default and mark the handle as active
            switch (event.keyCode) {
            case $.mobile.keyCode.HOME:
            case $.mobile.keyCode.END:
            case $.mobile.keyCode.PAGE_UP:
            case $.mobile.keyCode.PAGE_DOWN:
            case $.mobile.keyCode.UP:
            case $.mobile.keyCode.RIGHT:
            case $.mobile.keyCode.DOWN:
            case $.mobile.keyCode.LEFT:
                event.preventDefault();

                if (!this._keySliding) {
                    this._keySliding = true;
                    this.handle.addClass('ui-state-active');
                }
                break;
            }

            // move the slider according to the keypress
            switch (event.keyCode) {
            case $.mobile.keyCode.HOME:
                this.refresh(this.min);
                break;
            case $.mobile.keyCode.END:
                this.refresh(this.max);
                break;
            case $.mobile.keyCode.PAGE_UP:
            case $.mobile.keyCode.UP:
            case $.mobile.keyCode.RIGHT:
                this.refresh(index + this.step);
                break;
            case $.mobile.keyCode.PAGE_DOWN:
            case $.mobile.keyCode.DOWN:
            case $.mobile.keyCode.LEFT:
                this.refresh(index - this.step);
                break;
            }
        }, // remove active mark

        _handleKeyup: function(event) {
            if (this._keySliding) {
                this._keySliding = false;
                this.handle.removeClass('ui-state-active');
            }
        },

        _sliderVMouseDown: function(event) {
            // NOTE: we don't do this in refresh because we still want to
            //       support programmatic alteration of disabled inputs
            if (this.options.disabled || !(event.which === 1 ||
                                           event.which === 0 ||
                                           event.which === undefined)) {
                return false;
            }
            if (this._trigger('beforestart', event) === false) {
                return false;
            }
            this.dragging = true;
            this.userModified = false;
            this.mouseMoved = false;

            if (this.isToggleSwitch) {
                this.beforeStart = this.element[0].selectedIndex;
            }

            this.refresh(event);
            this._trigger('start');
            return false;
        },

        _sliderVMouseUp: function() {
            if (this.dragging) {
                this.dragging = false;

                if (this.isToggleSwitch) {
                    // make the handle move with a smooth transition
                    this.handle.addClass('ui-slider-vertical-handle-snapping');

                    if (this.mouseMoved) {
                        // this is a drag, change the value only if user dragged enough
                        if (this.userModified) {
                            this.refresh(this.beforeStart === 0 ? 1 : 0);
                        } else {
                            this.refresh(this.beforeStart);
                        }
                    } else {
                        // this is just a click, change the value
                        this.refresh(this.beforeStart === 0 ? 1 : 0);
                    }
                }

                this.mouseMoved = false;
                this._trigger('stop');
                return false;
            }
        },

        _preventDocumentDrag: function(event) {
            // NOTE: we don't do this in refresh because we still want to
            //       support programmatic alteration of disabled inputs
            if (this._trigger('drag', event) === false) {
                return false;
            }
            if (this.dragging && !this.options.disabled) {

                // this.mouseMoved must be updated before refresh() because it will be used in the control 'change' event
                this.mouseMoved = true;

                if (this.isToggleSwitch) {
                    // make the handle move in sync with the mouse
                    this.handle
                        .removeClass('ui-slider-vertical-handle-snapping');
                }

                this.refresh(event);

                // only after refresh() you can calculate this.userModified
                this.userModified = this
                    .beforeStart !== this.element[0].selectedIndex;
                return false;
            }
        },

        _checkedRefresh: function() {
            if (this.value !== this._value()) {
                this.refresh(this._value());
            }
        },

        _value: function() {
            return this.isToggleSwitch ?
                this.element[0].selectedIndex : parseFloat(this.element.val()) ;
        },

        _reset: function() {
            this.refresh(undefined, false, true);
        },

        refresh: function(val, isfromControl, preventInputUpdate) {
            // NOTE: we don't return here because we want to support programmatic
            //       alteration of the input value, which should still update the slider

            var self = this;
            var parentTheme = $.mobile.getInheritedTheme(this.element, 'c');
            var theme = this.options.theme || parentTheme;
            var trackTheme = this.options.trackTheme || parentTheme;
            var top;
            var height;
            var data;
            var tol;

            self.slider[0].className = [
                this.isToggleSwitch ?
                    'ui-slider-vertical ui-slider-vertical-switch' :
                    'ui-slider-vertical-track',
                ' ui-btn-down-' + trackTheme,
                ' ', (this.options.mini) ? ' ui-mini' : ''].join('');
            if (this.options.disabled || this.element.attr('disabled')) {
                this.disable();
            }

            // set the stored value for comparison later
            this.value = this._value();
            if (this.options.highlight && !this.isToggleSwitch &&
                this.slider.find('.ui-slider-vertical-bg').length === 0) {
                this.valuebg = (function() {
                    var bg = document.createElement('div');
                    bg.className = 'ui-slider-vertical-bg ' +
                        $.mobile.activeBtnClass + ' ';
                    return $(bg).prependTo(self.slider);
                })();
            }
            this.handle.buttonMarkup({
                corners: true,
                theme: theme,
                shadow: true
            });

            var pxStep;
            var percent;
            var control = this.element;
            var isInput = !this.isToggleSwitch;
            var optionElements = isInput ? [] : control.find('option');
            var min =  isInput ? parseFloat(control.attr('min')) : 0;
            var max = isInput ? parseFloat(control.attr('max')) :
                optionElements.length - 1;
            var step = (isInput && parseFloat(control.attr('step')) > 0) ?
                parseFloat(control.attr('step')) : 1;

            max -= 5;

            if (typeof val === 'object') {
                data = val;
                // a slight tolerance helped get to the ends of the slider
                tol = 8;

                top = this.slider.offset().top;
                height = this.slider.height();
                pxStep = height / ((max - min) / step);
                if (!this.dragging ||
                     data.pageY < top - tol ||
                     data.pageY > top + height + tol) {
                    return;
                }
                if (pxStep > 1) {
                    percent = ((data.pageY - top) / height) * 100;
                } else {
                    percent = Math.round(((data.pageY - top) / height) * 100);
                }
            } else {
                if (val === null) {
                    val = isInput ? parseFloat(control.val() || 0) :
                        control[0].selectedIndex;
                }
                percent = (parseFloat(val) - min) / (max - min) * 100;
            }

            if (isNaN(percent)) {
                return;
            }

            var newval = (percent / 100) * (max - min) + min;

            //from jQuery UI slider, the following source will round to the nearest step
            var valModStep = (newval - min) % step;
            var alignValue = newval - valModStep;

            if (Math.abs(valModStep) * 2 >= step) {
                alignValue += (valModStep > 0) ? step : (-step);
            }

            var percentPerStep = 100 / ((max - min) / step);
            // Since JavaScript has problems with large floats, round
            // the final value to 5 digits after the decimal point (see jQueryUI: #4124)
            newval = parseFloat(alignValue.toFixed(5));

            if (typeof pxStep === 'undefined') {
                pxStep = height / ((max - min) / step);
            }
            if (pxStep > 1 && isInput) {
                percent = (newval - min) * percentPerStep * (1 / step);
            }
            if (percent < 0) {
                percent = 0;
            }

            if (percent > 93) {
                percent = 93;
            }

            if (newval < min) {
                newval = min;
            }

            if (newval > max) {
                newval = max;
            }

            this.handle.css('top', percent + '%');

            this.handle[0].setAttribute(
                'aria-valuenow', isInput ? newval :
                    optionElements.eq(newval).attr('value'));

            this.handle[0].setAttribute(
                'aria-valuetext', isInput ? newval :
                    optionElements.eq(newval).getEncodedText());

            this.handle[0].setAttribute(
                'title', isInput ? newval :
                    optionElements.eq(newval).getEncodedText());

            if (this.valuebg) {
                this.valuebg.css('height',  (100 - percent) + '%');
            }
            if (this.fillbg) {
                this.fillbg.css('height', percent + '%');
            }

            // drag the label heights
            if (this._labels) {
                var handlePercent = this.handle.height() /
                    this.slider.height() * 100;
                var aPercent = percent && handlePercent +
                    (100 - handlePercent) * percent / 100;
                var bPercent = percent === 100 ? 0 :
                    Math.min(handlePercent + 100 - aPercent, 100);

                this._labels.each(function() {
                    var ab = $(this).is('.ui-slider-vertical-label-a');
                    $(this).height((ab ? aPercent : bPercent) + '%');
                });
            }

            if (!preventInputUpdate) {
                var valueChanged = false;

                // update control's value
                if (isInput) {
                    valueChanged = control.val() !== newval;
                    control.val(newval);
                } else {
                    valueChanged = control[ 0 ].selectedIndex !== newval;
                    control[ 0 ].selectedIndex = newval;
                }
                if (this._trigger('beforechange', val) === false) {
                    return false;
                }
                if (!isfromControl && valueChanged) {
                    control.trigger('change');
                }
            }
        },

        enable: function() {
            this.element.attr('disabled', false);
            this.slider.removeClass('ui-disabled').attr('aria-disabled', false);
            return this._setOption('disabled', false);
        },

        disable: function() {
            this.element.attr('disabled', true);
            this.slider.addClass('ui-disabled').attr('aria-disabled', true);
            return this._setOption('disabled', true);
        }

    }, $.mobile.behaviors.formReset));

    //auto self-init widgets
    $.mobile.document.bind('pagecreate create', function(e) {
        $.mobile.slider.prototype.enhanceWithin(e.target, true);
    });

})(jQuery);
