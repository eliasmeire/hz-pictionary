import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/throttleTime';

const mapEventToCoordinates = (canvas, event) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
};

const defaultOptions = {
  width: 10,
  color: '#000',
};

export const mouseEventStream = (canvas) => {
  const mouseDown$ = Observable.fromEvent(canvas, 'mousedown');
  const mouseMove$ = Observable.fromEvent(canvas, 'mousemove');
  const mouseUp$ = Observable.fromEvent(canvas, 'mouseup');

  return mouseDown$
      .switchMap(event =>
        mouseMove$
          .throttleTime(16)
          .startWith(event, event)
          .map(event => mapEventToCoordinates(canvas, event))
          .pairwise()
          .takeUntil(mouseUp$)
      );
};

export class CanvasDrawer {
  constructor(canvas, options = defaultOptions) {
    const { width, color } = options;
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = color;
  }

  renderLines(lines = []) {
    this.clear();
    this.ctx.beginPath();
    lines.forEach((line) => {
      const [p1, p2] = line;
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
    });
    this.ctx.stroke();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
