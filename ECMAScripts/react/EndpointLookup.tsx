


export default function EndpointLookup() {

    return <div className="fixed top-3 left-0 right-0 grid justify-items-center z-999">
        <div className="bg-blue-300 rounded-xl shadow-lg p-1.5">
            <div className="         sm:hidden ">EP: XS</div>
            <div className="sm:block hidden md:hidden">EP: SM</div>
            <div className="md:block hidden lg:hidden">EP: MD</div>
            <div className="lg:block hidden xl:hidden">EP: LG</div>
            <div className="xl:block hidden 2xl:hidden">EP: XL</div>
            <div className="2xl:block hidden">EP: 2XL</div>
        </div>
    </div>
}
