class MouseControl {
  #SPEED_FACTOR = 2;

  constructor(canvas) {
    this.canvas = canvas;
    this.isMouseDown = false;
    this.startCoordinates = [0, 0];
    this.endCoordinates = [0, 0];
    this.vector = [0, 0];

    this.canvas.addEventListener('mousedown', (event) => {
      this.isMouseDown = true;
      this.startCoordinates = [event.clientX, event.clientY];
    });

    this.canvas.addEventListener('mouseup', (event) => {
      this.isMouseDown = false;
    });

    this.canvas.addEventListener('mouseout', (event) => {
      this.isMouseDown = false;
    });

    this.canvas.addEventListener('mousemove', (event) => {
      if (this.isMouseDown) {
        let distanceX = this.startCoordinates[0] - event.clientX;
        let distanceY = this.startCoordinates[1] - event.clientY;
        this.vector = this.calculateTranslateVector(distanceX, distanceY);
        moveCamera(this.vector);
        console.log(this.vector);
        this.startCoordinates[0] = event.clientX;
        this.startCoordinates[1] = event.clientY;
      }
    });
  }

  calculateTranslateVector(distanceX, distanceY){
      return [-(distanceX/this.canvas.width) * this.#SPEED_FACTOR, (distanceY/this.canvas.height) * this.#SPEED_FACTOR, 0];
  }
}