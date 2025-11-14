export abstract class BaseUseCase<Input, Output> {
  abstract execute(request: Input): Promise<Output>;
}
