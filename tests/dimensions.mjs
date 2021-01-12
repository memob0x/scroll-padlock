import {
    DIMENSIONS_WIDTH_OUTER,
    DIMENSIONS_WIDTH_INNER,
    DIMENSIONS_WIDTH_SCROLL,
    DIMENSIONS_HEIGHT_OUTER,
    DIMENSIONS_HEIGHT_INNER,
    DIMENSIONS_HEIGHT_SCROLL,
    getDimensions
} from '../src/dimensions.mjs';

describe('dimensions', () => {
    const doc = document;
    const { documentElement, body } = doc;

    it('should be able to retrieve html elements dimensions', () => {
        const div = doc.createElement('div');

        body.append(div);

        const dimensions = getDimensions(div);
        
        expect(dimensions[DIMENSIONS_WIDTH_OUTER]).to.equals(div.offsetWidth);
        expect(dimensions[DIMENSIONS_HEIGHT_OUTER]).to.equals(div.offsetHeight);

        expect(dimensions[DIMENSIONS_WIDTH_INNER]).to.equals(div.clientWidth);
        expect(dimensions[DIMENSIONS_HEIGHT_INNER]).to.equals(div.clientHeight);
        
        expect(dimensions[DIMENSIONS_WIDTH_SCROLL]).to.equals(div.scrollWidth);
        expect(dimensions[DIMENSIONS_HEIGHT_SCROLL]).to.equals(div.scrollHeight);

        div.remove();
    });
    
    it('should be able to detect page dimensions', () => {
        const dimensions = getDimensions(documentElement, window);
        
        expect(dimensions[DIMENSIONS_WIDTH_OUTER]).to.equals(window.innerWidth);
        expect(dimensions[DIMENSIONS_HEIGHT_OUTER]).to.equals(window.innerHeight);

        expect(dimensions[DIMENSIONS_WIDTH_INNER]).to.equals(documentElement.clientWidth);
        expect(dimensions[DIMENSIONS_HEIGHT_INNER]).to.equals(documentElement.clientHeight);
        
        expect(dimensions[DIMENSIONS_WIDTH_SCROLL]).to.equals(documentElement.scrollWidth);
        expect(dimensions[DIMENSIONS_HEIGHT_SCROLL]).to.equals(documentElement.scrollHeight);
    });
});
