expands .Elements {
    val (value) {
        if (typeof value == 'string' || typeof value == 'number') {
            this.each( (i, el) {
                this.value = value;
            });
        } else {
            if (this[0]) {
                return this[0].value;
            }
            return null;
        }
        return this;
    }
}