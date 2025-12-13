
interface HeroReusableComponentProps {
    title: string;
    subHeading: string;
    description: string;
}
function HeroReusableComponent({ title, subHeading, description }: HeroReusableComponentProps) {
    return (
        <div className='flex flex-col items-center justify-center gap-4'>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {title}
                <br />
                <span className="text-gray-400 bg-clip-text">
                    {subHeading}
                </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12">
                {description}
            </p>
        </div>
    )
}

export default HeroReusableComponent