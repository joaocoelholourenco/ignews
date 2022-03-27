import Link from 'next/link';
import { SignInButton } from '../SignInButton';
import styles from './styles.module.scss';

export function Header() {
  return(
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news"/>
        <nav>
          <a href="/" className={styles.active}>
            Home
          </a>
          <Link href="/posts">
            Posts
          </Link>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
}