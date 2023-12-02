import Matchcard from './Matchcard';
import styles from '../app/styles/matches.module.css';

export default function MatchcardList({ matchcards }) {
    return (
        <div className={`${styles.cardGrid}`}>
            {matchcards.map((matches, index) => {
                return <Matchcard content={matches} key={index} />
            })}
        </div>
    )
}