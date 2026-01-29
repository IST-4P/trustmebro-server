using System.Text.Json;
using Confluent.Kafka;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SharedInfrastructure.Kafka.Abstractions;

namespace SharedInfrastructure.Kafka.Producer;

public sealed class KafkaProducer : IKafkaProducer, IDisposable
{
  private readonly IProducer<Null, string>? _producer;
  private readonly ILogger<KafkaProducer> _logger;
  private readonly bool _isEnabled;

  public KafkaProducer(IOptions<KafkaOptions> options, ILogger<KafkaProducer> logger)
  {
    _logger = logger;
    
    // Check if Kafka is configured
    if (string.IsNullOrWhiteSpace(options.Value.BootstrapServers))
    {
      _logger.LogWarning("Kafka BootstrapServers not configured. Kafka events will be disabled.");
      _isEnabled = false;
      return;
    }

    try
    {
      var config = new ProducerConfig
      {
        BootstrapServers = options.Value.BootstrapServers,
        ClientId = options.Value.ClientId,
        // Add timeout config to fail fast if Kafka is down
        MessageTimeoutMs = 5000, // 5 seconds timeout
        RequestTimeoutMs = 5000,
        SocketTimeoutMs = 5000
      };

      _producer = new ProducerBuilder<Null, string>(config).Build();
      _isEnabled = true;
      _logger.LogInformation("Kafka Producer initialized with BootstrapServers: {BootstrapServers}", options.Value.BootstrapServers);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Failed to initialize Kafka Producer. Events will be disabled.");
      _isEnabled = false;
    }
  }

  public async Task EmitAsync<T>(string topic, T payload, CancellationToken ct = default)
  {
    if (!_isEnabled || _producer == null)
    {
      _logger.LogWarning("Kafka is disabled. Event not sent to topic: {Topic}", topic);
      return;
    }

    try
    {
      var json = JsonSerializer.Serialize(payload);

      var result = await _producer.ProduceAsync(
          topic,
          new Message<Null, string> { Value = json },
          ct
      );
      
      _logger.LogDebug("Event sent to Kafka topic {Topic}: {Partition}:{Offset}", topic, result.Partition, result.Offset);
    }
    catch (ProduceException<Null, string> ex)
    {
      _logger.LogError(ex, "Failed to send event to Kafka topic {Topic}. Error: {ErrorReason}", topic, ex.Error.Reason);
      // Don't throw - just log the error so the main operation can continue
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Unexpected error sending event to Kafka topic {Topic}", topic);
      // Don't throw - just log the error
    }
  }

  public void Dispose() => _producer?.Dispose();
}
