using System.Text.Json;
using Confluent.Kafka;
using Microsoft.Extensions.Options;
using SharedInfrastructure.Kafka.Abstractions;

namespace SharedInfrastructure.Kafka.Producer;

public sealed class KafkaProducer : IKafkaProducer, IDisposable
{
  private readonly IProducer<Null, string> _producer;

  public KafkaProducer(IOptions<KafkaOptions> options)
  {
    var config = new ProducerConfig
    {
      BootstrapServers = options.Value.BootstrapServers,
      ClientId = options.Value.ClientId
    };

    _producer = new ProducerBuilder<Null, string>(config).Build();
  }

  public async Task EmitAsync<T>(string topic, T payload, CancellationToken ct = default)
  {
    var json = JsonSerializer.Serialize(payload);

    await _producer.ProduceAsync(
        topic,
        new Message<Null, string> { Value = json }
    );
  }

  public void Dispose() => _producer.Dispose();
}
