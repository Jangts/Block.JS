//Expends Events APIs To 'Elements'

expands .Elements {
    on (eventType, selector, data, handler) {
        switch (arguments.length) {
            case 3:
                handler = bool.isFn(data) ? data : undefined;
                data = null;
                break;
            case 2:
                handler = bool.isFn(selector) ? selector : undefined;
                selector = null;
                data = null;
                break;
        };
        this.each(() {
            if (bool.isArr(eventType)) {
                each(eventType as i, et) {
                    $..events.add(this, et, selector, data, handler);
                }
            } else {
                $..events.add(this, eventType, selector, data, handler);
            }
        });
        return this;
    }
    off (eventType, selector, handler) {
        this.each(() {
            if (bool.isArr(eventType)) {
                each(eventType as i, et) {
                    $..events.remove(this, et, selector, handler);
                }
            } else {
                $..events.remove(this, eventType, selector, handler);
            }
        });
        return this;
    }
    trigger (eventType, data) {
        this.each(() {
            $..events.trigger(this, eventType, data);
        });
        return this;
    }
    bind (eventType, data, handler) {
        if (arguments.length == 2) {
            handler = bool.isFn(data) ? data : undefined;
            data = undefined;
        }
        return this.on(eventType, null, data, handler);
    }
    unbind (eventType, handler) {
        return this.off(eventType, null, handler);
    }
    mouseover (data, handler) {
        return this.bind('mouseover', data, handler);
    }
    mouseout (data, handler) {
        return this.bind('mouseout', data, handler);
    }
    hover (overCallback, outCallback) {
        return this.mouseover(overCallback).mouseout(outCallback || overCallback);
    }
    mousedown (data, handler) {
        return this.bind('mousedown', data, handler);
    }
    mouseup (data, handler) {
        return this.bind('mouseup', data, handler);
    }
    mousemove (data, handler) {
        this.bind('mousemove', data, handler);
    }
    'click' (data, handler) {
        if (bool.isFn(handler)) {
            return this.bind('click', data, handler);
        }
        if (bool.isFn(data)) {
            return this.bind('click', data);
        }
        return this.trigger('click');
    }
    'focus' (data, handler) {
        if (bool.isFn(handler)) {
            return this.bind('focus', data, handler);
        }
        if (bool.isFn(data)) {
            return this.bind('focus', data);
        }
        return this.trigger('focus');
    }
    'blur' (data, handler) {
        if (bool.isFn(handler)) {
            return this.bind('blur', data, handler);
        }
        if (bool.isFn(data)) {
            return this.bind('blur', data);
        }
        return this.trigger('blur');
    }
    'submit' (data, handler) {
        if (bool.isFn(handler)) {
            return this.bind('submit', data, handler);
        }
        if (bool.isFn(data)) {
            return this.bind('submit', data);
        }
        return this.trigger('submit');
    }
}