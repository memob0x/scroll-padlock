import resemble from 'resemblejs';

export default async (img1, img2) => await new Promise(resolve => resemble(img1).compareTo(img2).onComplete(data => resolve(data)));
