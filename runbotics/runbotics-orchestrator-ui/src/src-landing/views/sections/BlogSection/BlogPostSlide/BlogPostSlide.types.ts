import { BlogPost } from '#contentful/common';


export interface IsVisibleProps {
    slideIndex: number;
    activeIndex: number;
    sliderWidth: number;
}

export interface BlogPostSlideProps {
    post: BlogPost;
    index: number;
}
