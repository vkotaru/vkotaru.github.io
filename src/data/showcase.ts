/**
 * The hero panels -- one per domain, the thirty-second version of what I work
 * on for anyone who lands on the front page and has no idea.
 *
 * Laid out 3x2, filling the right two-thirds of the screen:
 *
 *     +-----------+-----------+-----------+
 *     |  aerial   | humanoids |   manip   |
 *     +-----------+-----------+-----------+
 *     | planning  | adaptive  | autonomous|
 *     +-----------+-----------+-----------+
 *
 * The top row is the domains, the bottom row is specific work. Autonomous
 * keeps its cell even with no footage yet, because the label is half the
 * message.
 *
 * Six is what the grid holds. Adding a seventh means picking a new shape.
 *
 * A panel is a clip or a still, told apart by the file extension: `.mp4` and
 * `.webm` loop, anything else renders as an image.
 *
 * To swap a clip: drop `foo.mp4` in `public/media/`, make a poster with
 *
 *     ffmpeg -ss <mid-clip seconds> -i public/media/foo.mp4 -frames:v 1 \
 *            -q:v 4 public/media/posters/foo.jpg
 *
 * and point the panel at it.
 *
 * Hardware footage only. The simulation clips (3-D plots, composited renders)
 * are still on the publication cards, but they made the hero read like a
 * screensaver rather than like work that flew.
 */
export type Panel = {
  /** Domain name, shown on the panel. */
  label: string
  /** `.mp4`/`.webm` play as a loop; anything else renders as a still. */
  src?: string
  /** Poster frame for a clip. Not used by stills. */
  poster?: string
  /** Longer description, used as the accessible name of the link. */
  alt?: string
  /** Where the panel links. Omit for work with nothing to link to yet. */
  href?: string
  /** Shown instead of footage when there is none yet. */
  empty?: string
  /** Drawn artwork in place of footage. */
  art?: 'planner'
}

/** The 2x2, in reading order. */
export const panels: Panel[] = [
  {
    label: 'Collaborative aerial manipulation',
    // The first ten seconds of kite_draft3.mov, which is the title sequence
    // over the flight-lab shot.
    src: '/media/collabAerial.mp4',
    poster: '/media/posters/collabAerial.jpg',
    alt: 'The opening of the cable-suspended aerial grasping video: quadrotors in the Berkeley flight lab',
    href: '/dissertation',
  },
  {
    label: 'Humanoids',
    // cassie_ball_bouncing.mp4 at 20-30s: the front-on stretch where the ball
    // is in frame throughout. Before 19s there is a person in shot, after 44s
    // it cuts to mixed angles with picture-in-picture.
    src: '/media/cassieJuggle.mp4',
    poster: '/media/posters/cassieJuggle.jpg',
    alt: 'The bipedal robot Cassie bouncing a ball off its chest, front view',
    href: '/pdf/ECC2020CassieJuggling.pdf',
  },
  {
    label: 'Manipulation',
    // act_policy.mov, the whole cycle at 2x -- 20s of real time is a slow
    // watch in a tile. Shot portrait at 1080x1920, so it is cropped to the
    // band holding the arm, the orange and the bin: y 766-1374 of the
    // original.
    src: '/media/actPolicy.mp4',
    poster: '/media/posters/actPolicy.jpg',
    alt: 'A tabletop robot arm running a learned ACT policy: picking up an orange and placing it in a bin',
  },
  {
    label: 'Motion planning',
    // suspended_cable_planning.mp4 at 68-78s: the restricted-height case. The
    // planned S-shaped trajectory is drawn through the obstacles at about
    // 71-72.5s, then the quadrotor flies it.
    src: '/media/cablePlanning.mp4',
    poster: '/media/posters/cablePlanning.jpg',
    alt: 'A quadrotor with a suspended load flying an S-shaped planned path between two obstacles under a height limit',
    href: '/pdf/RAL2020PPQL.pdf',
  },
  {
    label: 'Reinforcement learning',
    // Placeholder: a generated image of parallel rollouts, cropped 16:9 from
    // the square original at y=224 so the fallen figures sit mid-frame. It
    // decorates the claim rather than evidencing it, and carries no link on
    // purpose -- the cart-pole RL post is still private. Swap it for a real
    // policy rollout when there is one.
    src: '/media/rlSwarm.jpg',
    alt: 'Many identical simulated humanoid robots walking in parallel, a few fallen -- reinforcement-learning rollouts',
  },
  {
    label: 'Autonomous driving',
    // No footage of this work can be public, so the tile is drawn instead:
    // a planner's view of a degraded road. See `PlannerView`.
    art: 'planner',
    alt: "A planner's view of a road: candidate trajectories converging on one planned path, with worn lane markings",
  },
]


