import NexsusUniverse from './NexsusUniverse'
import NexsusCounselling from './NexsusCounselling'
import NexsusAssist from './NexsusAssist'
import Cognito from './Cognito'
import Gryork from './Gryork'
import Washtro from './Washtro'
import WashingBro from './WashingBro'
import VigilantBhai from './VigilantBhai'
import FractureVision from './FractureVision'
import Haazir from './Haazir'
import AuroraHai from './AuroraHai'
import FinAgent from './FinAgent'
import AnandPumps from './AnandPumps'
import PathFinder from './PathFinder'
import MediChain from './MediChain'
import TechPreneur from './TechPreneur'
import GdgMmmut from './GdgMmmut'
import MmmutFdp from './MmmutFdp'
import QuizWise from './QuizWise'
import BookEase from './BookEase'

/**
 * Slug → bespoke page. Every project now has one.
 *
 * Each has its own file, palette, display face and section structure. The
 * generic template in ProjectDetail remains as a fallback so adding a project
 * to the data without a page here still renders something.
 *
 * Returns a rendered element rather than a component reference, so callers
 * never appear to construct a component during render.
 */
const PAGES = {
  'nexsus-universe': <NexsusUniverse />,
  'nexsus-counselling': <NexsusCounselling />,
  'nexsus-assist': <NexsusAssist />,
  'cognito-learning-hub': <Cognito />,
  gryork: <Gryork />,
  washtro: <Washtro />,
  'washing-bro': <WashingBro />,
  'vigilant-bhai': <VigilantBhai />,
  'fracturevision-ai': <FractureVision />,
  haazir: <Haazir />,
  aurorahai: <AuroraHai />,
  'finagent-ai': <FinAgent />,
  'anand-pumps': <AnandPumps />,
  'pathfinder-ai': <PathFinder />,
  'medichain-ai': <MediChain />,
  'gryork-techpreneur': <TechPreneur />,
  'gdg-mmmut': <GdgMmmut />,
  'mmmut-fdp': <MmmutFdp />,
  'quizwise-ai': <QuizWise />,
  bookease: <BookEase />,
}

export const getBespokePage = (slug) => PAGES[slug] ?? null
export const hasBespokePage = (slug) => slug in PAGES
