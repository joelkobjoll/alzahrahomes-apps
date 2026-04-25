import type {
  LoginDTO,
  RegisterDTO,
  ImpersonateDTO,
  LoginResponseDTO,
  MeResponseDTO,
} from '@alzahra/auth-config';

export interface AuthSDKOptions {
  baseUrl: string;
  fetchFn?: typeof fetch;
}

export class AuthSDK {
  private readonly baseUrl: string;
  private readonly fetchFn: typeof fetch;

  constructor(options: AuthSDKOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.fetchFn = options.fetchFn ?? fetch;
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await this.fetchFn(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as { data: T; error: unknown };
    if (json.error) throw new AuthSDKError(JSON.stringify(json.error), res.status);
    return json.data;
  }

  private async get<T>(path: string): Promise<T> {
    const res = await this.fetchFn(`${this.baseUrl}${path}`, {
      method: 'GET',
      credentials: 'include',
    });
    const json = (await res.json()) as { data: T; error: unknown };
    if (json.error) throw new AuthSDKError(JSON.stringify(json.error), res.status);
    return json.data;
  }

  async login(dto: LoginDTO): Promise<LoginResponseDTO> {
    return this.post<LoginResponseDTO>('/login', dto);
  }

  async logout(): Promise<void> {
    await this.post<void>('/logout', {});
  }

  async register(dto: RegisterDTO): Promise<LoginResponseDTO> {
    return this.post<LoginResponseDTO>('/register', dto);
  }

  async me(): Promise<MeResponseDTO> {
    return this.get<MeResponseDTO>('/me');
  }

  async impersonate(dto: ImpersonateDTO): Promise<LoginResponseDTO> {
    return this.post<LoginResponseDTO>('/impersonate', dto);
  }
}

export class AuthSDKError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'AuthSDKError';
  }
}
