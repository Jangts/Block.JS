let directions = {
    top(e) {
        if (e.changedTouches[0].clientY > this.ontouchY) {
            this.pause(false).playPr();
        } else if (e.changedTouches[0].clientY < this.ontouchY) {
            this.pause(false).playNx();
        }
        this.pauseOnAction && (this.autoplay = false);
    },
    right(e) {
        if (e.changedTouches[0].clientX < this.ontouchX) {
            this.pause(false).playPr();
        } else if (e.changedTouches[0].clientX > this.ontouchX) {
            this.pause(false).playNx();
        }
        this.pauseOnAction && (this.autoplay = false);
    },
    bottom(e) {
        if (e.changedTouches[0].clientY < this.ontouchY) {
            this.pause(false).playPr();
        } else if (e.changedTouches[0].clientY > this.ontouchY) {
            this.pause(false).playNx();
        }
        this.pauseOnAction && (this.autoplay = false);
    },
    left(e) {
        if (e.changedTouches[0].clientX > this.ontouchX) {
            this.pause(false).playPr();
        } else if (e.changedTouches[0].clientX < this.ontouchX) {
            this.pause(false).playNx();
        }
        this.pauseOnAction && (this.autoplay = false);
    },
};