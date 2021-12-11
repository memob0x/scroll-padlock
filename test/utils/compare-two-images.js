import resemble from 'resemblejs';

export default (img1, img2) => new Promise((resolve) => {
  resemble(img1)
    .compareTo(img2)
    .onComplete((data) => resolve(data));
});
