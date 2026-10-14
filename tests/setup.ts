// Mock three.js and react-three-fiber (browser-only, no WebGL in jsdom)
vi.mock("three", () => ({
  WebGLRenderer: vi.fn(),
  Scene: vi.fn(),
  PerspectiveCamera: vi.fn(),
}));

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => children,
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ camera: {}, gl: {}, scene: {} })),
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: vi.fn(),
  Environment: vi.fn(),
  ContactShadows: vi.fn(),
  Html: ({ children }: { children: React.ReactNode }) => children,
  useGLTF: vi.fn(() => ({ scene: { clone: vi.fn(() => ({})) } })),
  useProgress: vi.fn(() => ({ progress: 100, active: false })),
}));
