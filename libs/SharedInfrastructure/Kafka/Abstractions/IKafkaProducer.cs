namespace SharedInfrastructure.Kafka.Abstractions;

public interface IKafkaProducer
{
  Task EmitAsync<T>(string topic, T payload, CancellationToken ct = default);
}
