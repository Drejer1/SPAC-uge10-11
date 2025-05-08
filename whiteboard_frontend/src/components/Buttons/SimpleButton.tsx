
interface SimpleButtonProps {
    label: string;
    onClick: () => void;
}

const SimpleButton = ({label, onClick}: SimpleButtonProps) => {
    return (
        <button className="clear-button" onClick={onClick}>
            {label}
        </button>)
}

export default SimpleButton;